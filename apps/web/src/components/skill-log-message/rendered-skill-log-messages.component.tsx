import {
  DataFieldType,
  FormMessageType,
  InputFieldType,
  LandCommentsMessageType,
  LandCommentVo,
  LinkGroupType,
  LinkType,
  NotificationMessageType,
  PlainMessageType,
  UserActivityMessageType,
} from '@packages/shared-types';
import { formatDistance } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { mutateUserLandComment, useUser } from '../../libs';
import {
  DiceTossActivityEnum,
  diceTossActivityStatusAtom,
} from '../../libs/tdol-server/dice-toss-2/atoms/dice-toss-activity.atom';
import { useSubmitUserInteraction } from '../../libs/tdol-server/user-interaction';
import { skillLogMessagesState } from './atoms/skill-log-messages.atom';
import { SkillLogMessageInerface } from './interfaces/skill-log-message.interface';

const MessageWidth = 'w-max min-w ';
const MessageCommon = `${MessageWidth} my-0.5 md:my-1 leading-7 `;

const UserActivityMessageRadius = 'rounded-xl';
const UserActivityMessagePadding = 'p-5';
const UserActivityMessageCommon = `${UserActivityMessagePadding} ${UserActivityMessageRadius} bg-gray-800 text-gray-400 font-bold`;

const addedCommentsAtom = atom<Record<string, string>>({
  key: 'added-comments',
  default: {},
});

const Text: React.FC<{ t?: string }> = ({ t: text }) => {
  return (
    <>
      {text
        ? text.split('\n').map((line, index) => (
            <div key={index} className="break-all">
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
    if (diceTossActivityStatus.enum == DiceTossActivityEnum.Processing) {
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
    userActivityMessage.type == 'diceTossUserActivityMessage' &&
    isLast &&
    diceTossActivityStatus.enum == DiceTossActivityEnum.Processing
  ) {
    return (
      <div className="flex flex-row-reverse items-end">
        <div
          className={`${MessageCommon} ${UserActivityMessageCommon} text-right peer`}
        >
          <div className="text-xs mb-1 whitespace-nowrap">주사위 굴리는 중</div>
          <div>
            <span className=" text-white">
              {diceTossingNumbers.map((dice) => `🎲 ${dice}`).join(' · ')}
            </span>
          </div>
        </div>
        <div className="peer-hover:opacity-100 opacity-0 transition-opacity duration-150 text-gray-400 font-bold text-xs pl-2 text-right">
          {date.toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse items-end">
      <br style={{ fontSize: '0px' }} />
      <div
        className={`${MessageCommon} ${UserActivityMessageCommon} text-right peer`}
      >
        {userActivityMessage.description ? (
          <>
            <div className="text-xs mb-1 whitespace-nowrap">
              <Text t={userActivityMessage.title} />
            </div>
            <div>
              <Text t={userActivityMessage.description} />
            </div>
          </>
        ) : (
          <Text t={userActivityMessage.title} />
        )}
      </div>
      <div className="peer-hover:opacity-100 opacity-0 transition-opacity duration-150 text-gray-400 font-bold text-xs pl-2 text-right">
        {date.toLocaleString()}
      </div>
      <br style={{ fontSize: '0px' }} />
    </div>
  );
};

const PlainMessage: React.FC<{ plainMessage: PlainMessageType }> = ({
  plainMessage,
}) => {
  return (
    <div className="flex flex-row">
      <div
        className={`${MessageCommon} bg-gray-200 dark:bg-zinc-700 px-5 py-2 rounded-3xl flex gap-x-3`}
      >
        <div>
          <div className="font-bold text-lg md:text-xl">
            <Text t={plainMessage.title} />
          </div>
          <div className="text-sm md:text-base">
            <Text t={plainMessage.description} />
          </div>
        </div>
        {plainMessage.thumbnail && (
          <div className=" flex-shrink-0">
            <img
              src={plainMessage.thumbnail.imageUrl}
              alt={plainMessage.thumbnail.altName}
              className=" w-24 h-24 md:w-32 md:h-32 rounded-lg mt-3 mb-2 md:my-3 bg-white dark:bg-black object-contain object-bottom"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const NotificationPlainMessage: React.FC<{
  notificationMessage: NotificationMessageType;
}> = ({ notificationMessage }) => {
  return (
    <div className="leading-7 w-full bg-gray-200 dark:bg-zinc-700 px-3 py-3 rounded-xl flex items-center gap-x-3">
      {notificationMessage.thumbnail && (
        <div className=" flex-shrink-0">
          <img
            src={notificationMessage.thumbnail.imageUrl}
            alt={notificationMessage.thumbnail.altName}
            className="w-12 h-12 md:w-15 md:h-15 rounded-lg mt-3 mb-2 md:my-3 bg-white dark:bg-black object-contain object-bottom"
          />
        </div>
      )}
      <div>
        <div className="font-bold text-lg md:text-xl">
          <Text t={notificationMessage.title} />
        </div>
        <div className="text-sm md:text-base">
          <Text t={notificationMessage.description} />
        </div>
        <div className=" text-sm opacity-50">
          {formatDistance(new Date(notificationMessage.date), new Date(), {
            locale: ko,
          }).toString()}{' '}
          전
        </div>
      </div>
    </div>
  );
};

const linkMessageButtonBaseClassName =
  'px-10 py-3 mx-0.5 rounded-xl transition duration-150 select-none transform active:scale-95 text-sm md:text-base ';

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
      <div className="mt-1 text-sm md:text-base">
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
      } mr-5 mb-5 rounded-xl`}
    >
      <div className="font-bold text-xs md:text-sm text-gray-600 dark:text-zinc-400">
        {dataField.label}
      </div>
      <div className="text-base md:text-xl">
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
          <label htmlFor={id} className="text-xs md:text-sm font-bold">
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
            className={`text-sm md:text-base border-2 border-gray-400 rounded-md p-2 dark:text-black ${
              inputField.isDisabled == true ? 'cursor-not-allowed' : ''
            }`}
          />
        </div>
      )}
    </>
  );
};

const submitButtonBaseClassName =
  'px-10 py-3 mx-0.5 rounded-xl text-sm md:text-base';

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
      className={`w-max min-w ml-1 bg-white dark:bg-zinc-900 px-3 py-4 md:px-5 md:py-6 rounded-3xl border-2 border-gray-300 dark:border-zinc-500 flex-shrink-0 max-w-xs`}
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
      <div className="font-bold text-xs md:text-sm text-gray-600 dark:text-zinc-400">
        {form.title}
      </div>
      <div className="font-bold text-xl md:text-2xl mb-3">
        {form.description}
      </div>
      <div className="">
        {form.dataFields.map((dataField) => (
          <DataFieldMessage
            dataField={dataField}
            key={`${form.description}${dataField.label}${dataField.value}`}
          />
        ))}
      </div>
      <div>
        {form.inputFields.map((inputField) => (
          <InputFieldMessage
            inputField={inputField}
            key={`${form.description}${inputField.label}${inputField.name}`}
          />
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
      className={`${MessageCommon} bg-white dark:bg-zinc-900 px-3 py-4 md:px-5 md:py-6 rounded-3xl border-2 border-gray-300 dark:border-zinc-500 `}
    >
      <div className="font-bold text-lg md:text-2xl md:mb-1">
        {form.description}
      </div>
      <div className="text-sm md:text-base">완료되었습니다.</div>
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

const LandCommentsMessage: React.FC<{
  isLast: boolean;
  landComments: LandCommentVo[];
  messageKey: string;
}> = ({ isLast, landComments, messageKey }) => {
  const [addedComments, setAddedComments] = useRecoilState(addedCommentsAtom);
  const mutate = mutateUserLandComment();

  const thisComment = addedComments[messageKey];

  const { data: user } = useUser();

  const canAddComment = user?.canAddLandComment == true && isLast;

  return (isLast && user?.canAddLandComment == true) ||
    ((landComments.length > 0 || thisComment != undefined) &&
      isLast == false) ? (
    <div className=" text-xs md:text-sm pl-5 pr-2 pt-3 pb-5 flex flex-col gap-y-1">
      <div className=" font-bold text-sm md:text-base">댓글</div>
      <div className=" flex flex-col gap-y-0.5">
        {thisComment == undefined && landComments.length == 0 && (
          <span className="opacity-50">이 칸에 첫 번째 댓글을 달아보세요</span>
        )}
        {thisComment && (
          <div className=" flex gap-x-5">
            <div className=" opacity-50">{user?.username ?? '나'}</div>
            <div className=" break-all">{thisComment}</div>
            <div className=" opacity-50">방금 전</div>
          </div>
        )}
        {landComments.map((landComment) => (
          <div className=" flex gap-x-5">
            <div className=" opacity-50">{landComment.username}</div>
            <div className=" break-all">{landComment.comment}</div>
            <div className=" opacity-50">
              {formatDistance(new Date(landComment.date), new Date(), {
                locale: ko,
              }).toString()}{' '}
              전
            </div>
          </div>
        ))}
      </div>
      <div>
        <button
          className={`${
            isLast && thisComment == undefined
              ? 'underline'
              : ' disabled:opacity-30'
          } text-sm md:text-base`}
          disabled={isLast == false || thisComment != undefined}
          onClick={() => {
            const comment = prompt('댓글을 입력하세요 (최대 100자)');

            if (comment) {
              mutate.mutate({
                comment,
              });
              setAddedComments({
                ...addedComments,
                [messageKey]: comment,
              });
            }
          }}
        >
          {thisComment
            ? '댓글을 달았습니다'
            : canAddComment
            ? '이 칸에 댓글 달기'
            : '이 칸에 댓글 달기'}
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

const RenderedMessageByType: React.FC<{
  message:
    | FormMessageType
    | LinkGroupType
    | PlainMessageType
    | UserActivityMessageType
    | LandCommentsMessageType;
  isLastSkillLog: boolean;
  messageKey: string;

  date: Date;
}> = ({ message, isLastSkillLog: isLast, messageKey, date }) => {
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
    return (
      <PlainMessage plainMessage={message} key={`${messageKey}-plainMessage`} />
    );
  } else if (message.type == 'linkGroup') {
    return (
      <div className="overflow-x-auto">
        <LinkGroupMessage
          linkGroup={message as LinkGroupType}
          isLast={isLast}
          key={`${messageKey}-linkGroup`}
        />
      </div>
    );
  } else if (message.type == 'formMessage') {
    return (
      <div className="overflow-x-auto">
        <FormMessage
          form={message as FormMessageType}
          isLast={isLast}
          key={`${messageKey}-form`}
        />
      </div>
    );
  } else if (message.type == 'landComments') {
    return (
      <LandCommentsMessage
        isLast={isLast}
        landComments={message.landComments}
        key={`${messageKey}-lcm`}
        messageKey={messageKey}
      />
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
                messageKey={`${skillLogId}${index}-${col}`}
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
      messageKey={`${skillLogId}${index}`}
      date={skillLogMessage.date}
    />
  );
};

export const RenderedSkillLogMessages: React.FC = () => {
  const skillLogMessages = useRecoilValue(skillLogMessagesState);

  const lastSkillLogId =
    skillLogMessages.length > 0
      ? skillLogMessages[skillLogMessages.length - 1].skillLogId
      : '';

  return (
    <>
      {skillLogMessages.map((message, index) => {
        const isLastSkillLog = message.skillLogId == lastSkillLogId;

        return (
          <RenderedSkillLogMessage
            skillLogMessage={message}
            index={index}
            isLastSkillLog={isLastSkillLog}
            key={`slm${message.skillLogId}${index}${message.date}`}
          />
        );
      })}
    </>
  );
};
