import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DataFieldType,
  FormMessageType,
  InputFieldType,
  LinkGroupType,
  LinkType,
  PlainMessageType,
  UserActivityMessageType
} from "..";
import { useSubmitUserInteraction } from "../tdol-server/user-interaction";

const MessageWidth = "w-max min-w ";
const MessageCommon = `${MessageWidth} my-1 mx-2`;

const UserActivityMessageRadius = "rounded-xl";
const UserActivityMessagePadding = "p-5";
const UserActivityMessageCommon = `${UserActivityMessagePadding} ${UserActivityMessageRadius} bg-gray-800 text-gray-400 font-bold`;

const Text: React.FC<{ t?: string }> = ({ t: text }) => {
  return (
    <>
      {text
        ? text.split("\n").map((line, index) => (
            <div key={index}>
              {line}
              <br />
            </div>
          ))
        : ""}
    </>
  );
};

export const UserActivityMessage: React.FC<{
  userActivityMessage: UserActivityMessageType;
}> = ({ userActivityMessage }) => {
  if (userActivityMessage.description) {
    return (
      <div className="flex flex-row-reverse">
        <div
          className={`${MessageCommon} ${UserActivityMessageCommon} text-right`}
        >
          <div className="text-xs mb-1">
            <Text t={userActivityMessage.title} />
          </div>
          <div>
            <Text t={userActivityMessage.description} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse">
      <div className={`${MessageCommon} ${UserActivityMessageCommon}`}>
        <Text t={userActivityMessage.title} />
      </div>
    </div>
  );
};

export const PlainMessage: React.FC<{ plainMessage: PlainMessageType }> = ({
  plainMessage
}) => {
  return (
    <div className="flex flex-row">
      <div className={`${MessageCommon} bg-gray-200 px-5 py-2 rounded-3xl`}>
        <div className="font-bold text-xl">
          <Text t={plainMessage.title} />
        </div>
        <div>
          <Text t={plainMessage.description} />
        </div>
      </div>
    </div>
  );
};

export const LinkMessage: React.FC<{
  link: LinkType;
  mutate: any;
  isButtonActive: boolean;
}> = ({ link, mutate, isButtonActive }) => {
  return isButtonActive == true ? (
    <button
      className="text-white px-10 py-3 mx-0.5 rounded-xl bg-blue-500 hover:bg-blue-400 active:bg-blue-700 transition duration-150 select-none transform active:scale-95"
      onClick={() => {
        mutate.mutate({
          callingSkillParam: link.param,
          callingSkillRoute: link.skillRoute
        });
      }}
    >
      {link.displayText}
    </button>
  ) : (
    <button className="text-white px-10 py-3 mx-0.5 rounded-xl bg-gray-600 cursor-not-allowed">
      {link.displayText}
    </button>
  );
};

export const LinkGroupMessage: React.FC<{
  linkGroup: LinkGroupType;
  isAvailable: boolean;
}> = ({ linkGroup, isAvailable }) => {
  const [issue, setIssue] = useState<null | string>(null);

  const mutate = useSubmitUserInteraction((error) => {
    setIssue("이미 진행했어요! 주사위를 굴리세요.");
    setTimeout(() => {
      setIssue(null);
    }, 3000);
  });

  return (
    <div className={`${MessageCommon} bg-gray-200 px-5 py-2 rounded-3xl`}>
      <div className="mt-1">
        <Text t={linkGroup.description} />
      </div>
      <div className="mt-3">
        {linkGroup.links.map((link) => (
          <LinkMessage
            key={link.displayText}
            link={link}
            mutate={mutate}
            isButtonActive={isAvailable}
          />
        ))}
        <div className="text-red-500 font-bold text-sm mt-2">{issue}</div>
      </div>
    </div>
  );
};

export const DataFieldMessage: React.FC<{ dataField: DataFieldType }> = ({
  dataField
}) => {
  return (
    <div
      className={`${
        dataField.inline ? "inline-block" : "block"
      } mr-5 mb-5 rounded-xl `}
    >
      <div className="font-bold text-sm text-gray-600">{dataField.label}</div>
      <div className="text-xl">{dataField.value}</div>
    </div>
  );
};

export const InputFieldMessage: React.FC<{
  inputField: InputFieldType;
  setFormParam: Function;
}> = ({ inputField, setFormParam }) => {
  const id = uuidv4();
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-bold">
        {inputField.label}
      </label>
      <input
        onChange={(e) => setFormParam({ [inputField.name]: e.target.value })}
        id={id}
        name={inputField.name}
        type="text"
        placeholder={inputField.placeholder}
        maxLength={inputField.maxLength}
        minLength={inputField.minLength}
        className="border-2 border-gray-400 rounded-md p-2"
      />
    </div>
  );
};

export const SubmitButton: React.FC<{
  label: string;
  mutate: any;
  isButtonActive: boolean;
}> = ({ label, mutate, isButtonActive }) => {
  return isButtonActive == true ? (
    <button
      className="text-white px-10 py-3 mx-0.5 rounded-xl bg-blue-500 hover:bg-blue-400 active:bg-blue-700 transition duration-150 select-none transform active:scale-95"
      onClick={mutate}
    >
      {label}
    </button>
  ) : (
    <button className="text-white px-10 py-3 mx-0.5 rounded-xl bg-gray-600 cursor-not-allowed">
      {label}
    </button>
  );
};

export const FormMessage: React.FC<{
  form: FormMessageType;
  isAvailable: boolean;
}> = ({ form, isAvailable }) => {
  const [formParam, setFormParam] = useState({});

  const mutate = useSubmitUserInteraction();

  return isAvailable ? (
    <div
      className={`${MessageCommon} bg-white px-5 rounded-3xl border-2 border-gray-300 py-6`}
    >
      <div className="font-bold text-2xl mb-3">{form.description}</div>
      <div className="">
        {form.dataFields.map((dataField) => (
          <DataFieldMessage dataField={dataField} />
        ))}
      </div>
      <div>
        {form.inputFields.map((inputField) => (
          <InputFieldMessage
            inputField={inputField}
            setFormParam={setFormParam}
          />
        ))}
      </div>
      <div className="text-center mt-5 text-xl">
        <SubmitButton
          mutate={() => {
            mutate.mutate({
              callingSkillParam: formParam,
              callingSkillRoute: form.submitSkillRoute
            });
          }}
          isButtonActive={true}
          label={form.submitButtonLabel}
        />
      </div>
    </div>
  ) : (
    <div
      className={`${MessageCommon} bg-white px-5 rounded-3xl border-2 border-gray-300 py-6`}
    >
      <div className="font-bold text-2xl mb-3">{form.description}</div>
      완료되었습니다.
    </div>
  );
};
