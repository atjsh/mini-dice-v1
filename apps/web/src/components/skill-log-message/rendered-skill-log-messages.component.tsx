import {
  DataFieldType,
  FormMessageType,
  InputFieldType,
  LinkGroupType,
  LinkType,
  PlainMessageType,
  UserActivityMessageType,
} from '@packages/shared-types';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import {
  DiceTossActivityEnum,
  diceTossActivityStatusAtom,
} from '../../libs/tdol-server/dice-toss-2/atoms/dice-toss-activity.atom';
import { useSubmitUserInteraction } from '../../libs/tdol-server/user-interaction';
import { skillLogMessagesState } from './atoms/skill-log-messages.atom';
import { SkillLogMessageInerface } from './interfaces/skill-log-message.interface';

const MessageWidth = 'w-max min-w ';
const MessageCommon = `${MessageWidth} my-1 ml-1 leading-7 `;

const UserActivityMessageRadius = 'rounded-xl';
const UserActivityMessagePadding = 'p-5';
const UserActivityMessageCommon = `${UserActivityMessagePadding} ${UserActivityMessageRadius} bg-gray-800 text-gray-400 font-bold`;

const Text: React.FC<{ t?: string }> = ({ t: text }) => {
  return (
    <>
      {text
        ? text.split('\n').map((line, index) => (
            <div key={index}>
              {line}
              <br />
            </div>
          ))
        : ''}
    </>
  );
};

function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const UserActivityMessage: React.FC<{
  userActivityMessage: UserActivityMessageType;
  date: Date;
  isLast: boolean;
}> = ({ userActivityMessage, date, isLast }) => {
  const diceTossActivityStatus = useRecoilValue(diceTossActivityStatusAtom);

  const [diceTossingNumbers, setDiceTossingNumbers] = useState([
    getRandomInteger(1, 6),
    getRandomInteger(1, 6),
  ]);

  useEffect(() => {
    if (diceTossActivityStatus == DiceTossActivityEnum.Processing) {
      const numberChangingInterval = setInterval(
        () =>
          setDiceTossingNumbers([
            getRandomInteger(1, 6),
            getRandomInteger(1, 6),
          ]),
        200,
      );

      return () => {
        clearInterval(numberChangingInterval);
      };
    }
  }, [diceTossActivityStatus]);

  if (
    userActivityMessage.type == 'diceTossUserActivityMessage' && isLast &&
    diceTossActivityStatus == DiceTossActivityEnum.Processing
  ) {
    return (
      <div className="flex flex-row-reverse items-end">
        <div
          className={`${MessageCommon} ${UserActivityMessageCommon} text-right peer`}
        >
          <div className="text-xs mb-1">주사위 굴리는 중</div>
          <div>
            <span className=" text-white">
              {diceTossingNumbers.map((dice) => `🎲 ${dice}`).join(' · ')}
            </span>
          </div>
        </div>
        <div className="peer-hover:opacity-100 opacity-0 transition-opacity duration-150 text-gray-400 font-bold text-xs pl-2">
          {date.toLocaleString()}
        </div>
      </div>
    );
  }

  if (userActivityMessage.description) {
    return (
      <div className="flex flex-row-reverse items-end">
        <br style={{ fontSize: '0px' }} />
        <div
          className={`${MessageCommon} ${UserActivityMessageCommon} text-right peer`}
        >
          <div className="text-xs mb-1">
            <Text t={userActivityMessage.title} />
          </div>
          <div>
            <Text t={userActivityMessage.description} />
          </div>
        </div>
        <div className="peer-hover:opacity-100 opacity-0 transition-opacity duration-150 text-gray-400 font-bold text-xs pl-2">
          {date.toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse">
      <br style={{ fontSize: '0px' }} />
      <div className={`${MessageCommon} ${UserActivityMessageCommon}`}>
        <Text t={userActivityMessage.title} />
      </div>
    </div>
  );
};

const PlainMessage: React.FC<{ plainMessage: PlainMessageType }> = ({
  plainMessage,
}) => {
  return (
    <div className="flex flex-row">
      <div
        className={`${MessageCommon} bg-gray-200 dark:bg-zinc-700 px-5 py-2 rounded-3xl`}
      >
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

const linkMessageButtonBaseClassName =
  'px-10 py-3 mx-0.5 rounded-xl transition duration-150 select-none transform active:scale-95';

const LinkMessage: React.FC<{
  link: LinkType;
  mutate: any;
  isDisabled: boolean;
  isButtonClicked: boolean;
  setIsButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  activateIssue: () => void;
}> = ({
  link,
  mutate,
  isDisabled,
  isButtonClicked,
  setIsButtonClicked,
  activateIssue,
}) => {
  return isDisabled ? (
    <button
      className={`${linkMessageButtonBaseClassName} text-white bg-gray-600 cursor-not-allowed`}
      onClick={activateIssue}
    >
      {link.displayText}
    </button>
  ) : isButtonClicked ? (
    <button
      className={`${linkMessageButtonBaseClassName} text-white bg-gray-600 cursor-progress`}
      onClick={activateIssue}
    >
      {link.displayText}
    </button>
  ) : (
    <button
      className={`${linkMessageButtonBaseClassName} text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700`}
      onClick={() => {
        setIsButtonClicked(true);
        mutate.mutate(
          {
            callingSkillParam: link.param,
            callingSkillRoute: link.skillRouteURL,
          },
          {
            onError: () => {
              setIsButtonClicked(false);
            },
          },
        );
      }}
    >
      {link.displayText}
    </button>
  );
};

const LinkGroupMessage: React.FC<{
  linkGroup: LinkGroupType;
  isLast: boolean;
}> = ({ linkGroup, isLast }) => {
  const [issue, setIssue] = useState<null | string>(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const activateIssue = () => {
    setIssue('이미 진행했어요! 주사위를 굴리세요.');
    setTimeout(() => {
      setIssue(null);
    }, 3000);
  };

  const mutate = useSubmitUserInteraction(activateIssue);

  return (
    <div
      className={`${MessageCommon} bg-gray-200 dark:bg-zinc-700 px-5 py-2 rounded-3xl`}
    >
      <div className="mt-1">
        <Text t={linkGroup.description} />
      </div>
      <div className="mt-3">
        {linkGroup.links.map((link) => (
          <LinkMessage
            key={link.displayText}
            link={link}
            mutate={mutate}
            isDisabled={!isLast}
            isButtonClicked={isButtonClicked}
            setIsButtonClicked={setIsButtonClicked}
            activateIssue={activateIssue}
          />
        ))}
        <div className="text-red-400 font-bold text-sm mt-2">{issue}</div>
      </div>
    </div>
  );
};

const DataFieldMessage: React.FC<{ dataField: DataFieldType }> = ({
  dataField,
}) => {
  return (
    <div
      className={`${
        dataField.inline ? 'inline-block' : 'block'
      } mr-5 mb-5 rounded-xl `}
    >
      <div className="font-bold text-sm text-gray-600 dark:text-zinc-400">
        {dataField.label}
      </div>
      <div className="text-xl">
        {dataField.isCash
          ? `${BigInt(dataField.value).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`
          : dataField.value}
      </div>
    </div>
  );
};

const InputFieldMessage: React.FC<{
  inputField: InputFieldType;
}> = ({ inputField }) => {
  const id = uuidv4();
  return (
    <>
      {inputField.isHidden ? (
        <>
          <input
            defaultValue={inputField.defaultValue}
            id={id}
            name={inputField.name}
            type={inputField.type}
            hidden={
              inputField.isHidden != undefined ? inputField.isHidden : false
            }
            required
          />
        </>
      ) : (
        <div className="flex flex-col">
          <label htmlFor={id} className="text-sm font-bold">
            {inputField.label}
          </label>
          <input
            id={id}
            name={inputField.name}
            type={inputField.type}
            placeholder={inputField.placeholder}
            maxLength={inputField.maxLength}
            minLength={inputField.minLength}
            max={inputField.maxNumber}
            min={inputField.minNumber}
            hidden={
              inputField.isHidden != undefined ? inputField.isHidden : false
            }
            disabled={
              inputField.isDisabled != undefined ? inputField.isDisabled : false
            }
            required
            className={`border-2 border-gray-400 rounded-md p-2 dark:text-black ${
              inputField.isDisabled == true ? 'cursor-not-allowed' : ''
            }`}
          />
        </div>
      )}
    </>
  );
};

const submitButtonBaseClassName = 'px-10 py-3 mx-0.5 rounded-xl';

const SubmitButton: React.FC<{
  label: string;
  isDisabled: boolean;
  isButtonClicked: boolean;
}> = ({ label, isDisabled, isButtonClicked }) => {
  return isDisabled ? (
    <button
      className={`text-white ${submitButtonBaseClassName} rounded-xl bg-gray-600 cursor-not-allowed`}
    >
      {label}
    </button>
  ) : isButtonClicked ? (
    <button
      className={`text-white ${submitButtonBaseClassName} rounded-xl bg-gray-600 cursor-progress`}
    >
      {label}
    </button>
  ) : (
    <button
      className={`text-white ${submitButtonBaseClassName} rounded-xl bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700 transition duration-150 select-none transform active:scale-95`}
      type="submit"
    >
      {label}
    </button>
  );
};

const FormMessage: React.FC<{
  form: FormMessageType;
  isLast: boolean;
  isNeighborButtonClicked?: boolean;
  setIsisNeighborButtonClicked?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  form,
  isLast,
  isNeighborButtonClicked,
  setIsisNeighborButtonClicked,
}) => {
  const [isOwnButtonClicked, setIsOwnButtonClicked] = useState(false);

  const isButtonClicked =
    isNeighborButtonClicked != undefined
      ? isNeighborButtonClicked
      : isOwnButtonClicked;
  const setIsButtonClicked =
    setIsisNeighborButtonClicked != undefined
      ? setIsisNeighborButtonClicked
      : setIsOwnButtonClicked;

  const mutate = useSubmitUserInteraction();

  return isLast ? (
    <form
      className={`w-max min-w ml-1 bg-white dark:bg-zinc-900 px-5 rounded-3xl border-2 border-gray-300 dark:border-zinc-500 py-6 flex-shrink-0 max-w-xs `}
      onSubmit={(e) => {
        e.preventDefault();
        setIsButtonClicked(true);

        const data = {};
        for (let index = 0; index < (e.target as any).length - 1; index++) {
          data[e.target[index].name] = e.target[index].value;
        }

        mutate.mutate(
          {
            callingSkillParam: data,
            callingSkillRoute: form.submitSkillRouteURL,
          },
          {
            onError: () => {
              setIsButtonClicked(false);
            },
          },
        );
      }}
    >
      <div className="font-bold text-sm text-gray-600 dark:text-zinc-400">
        {form.title}
      </div>
      <div className="font-bold text-2xl mb-3">{form.description}</div>
      <div className="">
        {form.dataFields.map((dataField) => (
          <DataFieldMessage dataField={dataField} />
        ))}
      </div>
      <div>
        {form.inputFields.map((inputField) => (
          <InputFieldMessage inputField={inputField} />
        ))}
      </div>
      <div className="text-center mt-5 text-xl">
        <SubmitButton
          isDisabled={
            form.isSubmitButtonDisabled != undefined
              ? form.isSubmitButtonDisabled
              : false
          }
          label={form.submitButtonLabel}
          isButtonClicked={isButtonClicked}
        />
      </div>
    </form>
  ) : (
    <div
      className={`${MessageCommon} bg-white dark:bg-zinc-900 px-5 rounded-3xl border-2 border-gray-300 dark:border-zinc-500 py-6`}
    >
      <div className="font-bold text-2xl mb-3">{form.description}</div>
      완료되었습니다.
    </div>
  );
};

const FormMessageGroup: React.FC<{
  formMessages: FormMessageType[];
  isLast: boolean;
}> = ({ formMessages, isLast }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  return (
    <>
      <div className=" flex flex-col mt-3 my-1">
        <div
          className={`dark:text-gray-600 text-gray-400 font-bold pl-2 ${
            isLast ? '' : 'hidden'
          }`}
        >
          {formMessages.length > 1
            ? `${formMessages.length}가지 중에서 선택 - 좌우로 스크롤하여 더 보기`
            : ''}
        </div>
        <div className=" flex flex-row overflow-x-scroll rounded-3xl gap-x-2 items-start">
          {formMessages.map((formMessage, index) => (
            <FormMessage
              form={formMessage}
              isLast={isLast}
              isNeighborButtonClicked={isButtonClicked}
              setIsisNeighborButtonClicked={setIsButtonClicked}
              key={`${formMessage.description}-${index}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const RenderedMessageByType: React.FC<{
  message:
    | FormMessageType
    | LinkGroupType
    | PlainMessageType
    | UserActivityMessageType;
  isLastSkillLog: boolean;
  key: string;
  date: Date;
}> = ({ message, isLastSkillLog: isLast, key, date }) => {
  if (
    message.type == 'diceTossUserActivityMessage' ||
    message.type == 'interactionUserActivityMessage'
  ) {
    return (
      <UserActivityMessage
        userActivityMessage={message}
        date={date}
        isLast={isLast}
      />
    );
  } else if (message.type == 'plainMessage') {
    return <PlainMessage plainMessage={message} key={`${key}-plainMessage`} />;
  } else if (message.type == 'linkGroup') {
    return (
      <div className="overflow-x-auto">
        <LinkGroupMessage
          linkGroup={message as LinkGroupType}
          isLast={isLast}
          key={`${key}-linkGroup`}
        />
      </div>
    );
  } else if (message.type == 'formMessage') {
    return (
      <div className="overflow-x-auto">
        <FormMessage
          form={message as FormMessageType}
          isLast={isLast}
          key={`${key}-form`}
        />
      </div>
    );
  }

  return {} as never;
};

const RenderedSkillLogMessage: React.FC<{
  skillLogMessage: SkillLogMessageInerface;
  isLastSkillLog: boolean;
  index: number;
}> = ({ skillLogMessage, index, isLastSkillLog }) => {
  const { skillLogId } = skillLogMessage;

  if (Array.isArray(skillLogMessage.message)) {
    return (
      <>
        {skillLogMessage.message[0].type == 'formMessage' ? (
          <FormMessageGroup
            formMessages={skillLogMessage.message as FormMessageType[]}
            isLast={isLastSkillLog}
            key={`${skillLogId}${index}`}
          />
        ) : (
          skillLogMessage.message.map((message, col: number) => (
            <div className=" flex flex-row overflow-x-scroll rounded-3xl gap-x-2 items-start">
              <RenderedMessageByType
                message={message as PlainMessageType}
                isLastSkillLog={isLastSkillLog}
                key={`${skillLogId}${index}-${col}`}
                date={skillLogMessage.date}
              />
            </div>
          ))
        )}
      </>
    );
  }

  return (
    <RenderedMessageByType
      message={skillLogMessage.message}
      isLastSkillLog={isLastSkillLog}
      key={`${skillLogId}${index}`}
      date={skillLogMessage.date}
    />
  );
};

export const RenderedSkillLogMessages: React.FC<{}> = () => {
  const skillLogMessages = useRecoilValue(skillLogMessagesState);

  const lastSkillLogId =
    skillLogMessages.length > 0
      ? skillLogMessages[skillLogMessages.length - 1].skillLogId
      : '';

  return (
    <>
      {skillLogMessages.map((message, index) => (
        <RenderedSkillLogMessage
          skillLogMessage={message}
          index={index}
          isLastSkillLog={message.skillLogId == lastSkillLogId}
        />
      ))}
    </>
  );
};
