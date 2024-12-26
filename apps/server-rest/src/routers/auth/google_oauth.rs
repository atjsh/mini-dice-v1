use serde::Deserialize;

use crate::env_values;

#[derive(Deserialize)]
struct GoogleUser {
    email: String,
    verified_email: bool,
}

async fn get_google_user_from_google_api(
    access_token: String,
) -> Result<GoogleUser, reqwest::Error> {
    let client = reqwest::Client::new();
    let res = client
        .get(format!(
            "https://www.googleapis.com/oauth2/v1/userinfo?access_token={}",
            access_token
        ))
        .send()
        .await?
        .json::<GoogleUser>()
        .await?;
    Ok(res)
}

async fn get_google_access_token_from_google_oauth_code(
    google_oauth_code: String,
    redirect_uri: String,
) -> Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let res = client
        .post("https://oauth2.googleapis.com/token")
        .form(&[
            ("code", google_oauth_code),
            ("client_id", env_values::GOOGLE_CLIENT_ID.to_owned()),
            ("client_secret", env_values::GOOGLE_CLIENT_SECRET.to_owned()),
            ("redirect_uri", redirect_uri),
            ("grant_type", "authorization_code".to_owned()),
        ])
        .send()
        .await?
        .json::<serde_json::Value>()
        .await?;
    Ok(res["access_token"].as_str().unwrap().to_string())
}

pub mod email_encryptor {
    use aes_gcm::{
        aead::{generic_array::GenericArray, Aead},
        AeadCore, Aes256Gcm, KeyInit, Nonce,
    };
    use base64::prelude::*;

    use crate::env_values;

    pub struct EncryptedEmail {
        pub encrypted_email: String,
        pub nonce: GenericArray<u8, <Aes256Gcm as AeadCore>::NonceSize>,
    }

    pub fn encrypt(email: String) -> EncryptedEmail {
        let db_encryption_key = std::env::var(env_values::DB_ENCRYPTION_KEY).unwrap();
        let key = aes_gcm::Key::<Aes256Gcm>::from_slice(db_encryption_key.as_bytes());

        println!("key: {:?}", key);

        let cipher = Aes256Gcm::new(key);
        let nonce = Aes256Gcm::generate_nonce(&mut aes_gcm::aead::OsRng);
        let encrypted_email = cipher.encrypt(&nonce, email.as_bytes().as_ref());

        if encrypted_email.is_err() {
            panic!("Failed to encrypt email");
        }

        EncryptedEmail {
            encrypted_email: BASE64_STANDARD.encode(encrypted_email.unwrap()),
            nonce,
        }
    }

    pub fn decrypt(encrypted_email: EncryptedEmail) -> String {
        let db_encryption_key = std::env::var(env_values::DB_ENCRYPTION_KEY).unwrap();
        let key = aes_gcm::Key::<Aes256Gcm>::from_slice(db_encryption_key.as_bytes());

        let cipher = Aes256Gcm::new(key);
        let decrypted_email = cipher.decrypt(
            &encrypted_email.nonce,
            BASE64_STANDARD
                .decode(encrypted_email.encrypted_email)
                .unwrap()
                .as_ref(),
        );

        if (decrypted_email.is_err()) {
            println!("{:#?}", decrypted_email.err().unwrap());

            panic!("Failed to decrypt email");
        }

        String::from_utf8(decrypted_email.unwrap()).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_email_encryptor() {
        let email = "letaem77@gmail.com".to_owned();

        let encrypted_email = email_encryptor::encrypt(email.clone());

        println!("encrypted_email: {}", encrypted_email.encrypted_email);
        println!("nonce: {:?}", encrypted_email.nonce);

        assert_ne!(email, encrypted_email.encrypted_email);

        let decrypted_email = email_encryptor::decrypt(encrypted_email);

        assert_eq!(email, decrypted_email);
    }
}

pub mod get_encrypted_email_by_google_oauth_code {
    use axum::{extract::Query, response::IntoResponse};
    use http::StatusCode;
    use serde::{Deserialize, Serialize};

    use super::*;

    #[derive(Deserialize)]
    pub struct OAuthCodeQuery {
        code: String,
    }

    #[derive(Serialize)]
    pub struct Response {
        encrypted_email: String,
    }

    pub async fn handler(
        query: Query<OAuthCodeQuery>,
    ) -> Result<impl IntoResponse, (StatusCode, String)> {
        let oauth_code = query.0.code;

        let access_token = get_google_access_token_from_google_oauth_code(
            oauth_code,
            "http://localhost:3000/auth/google_oauth".to_owned(),
        )
        .await;

        if access_token.is_err() {
            return Err((StatusCode::UNAUTHORIZED, "Invalid OAuth code".to_owned()));
        }

        let google_user = get_google_user_from_google_api(access_token.unwrap()).await;

        if google_user.is_err() {
            return Err((StatusCode::UNAUTHORIZED, "Invalid OAuth code".to_owned()));
        }

        Ok(axum::Json(Response {
            encrypted_email: "encrypted_email".to_owned(),
        }))
    }
}
