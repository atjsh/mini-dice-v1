import {
  MessageResponseType,
  UserActivityMessage,
  PlainMessage,
  LinkGroupMessage,
  LinkGroupType,
  FormMessage,
  FormMessageType,
  PlainMessageType,
  FormMessageGroup,
} from '.';

function transformMessage(
  message: FormMessageType | LinkGroupType | PlainMessageType,
  isLast: boolean,
  key: string,
) {
  if (message.type == 'plainMessage') {
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
}

export function transformDicetossAnimationMessage(diceResult: number[]) {
  return <div></div>;
}

export const TransformSkillLogToMessage: React.FC<{
  skillLog: MessageResponseType;
  isLast: boolean;
  skillLogId: string;
}> = ({ skillLog, isLast, skillLogId }) => (
  <>
    <UserActivityMessage
      userActivityMessage={skillLog.userRequestDrawings}
      date={new Date(skillLog.date)}
      isLast={isLast}
    />
    {skillLog.actionResultDrawings.map((messageData, row) => {
      if (Array.isArray(messageData)) {
        return (
          <div className=" flex flex-row overflow-x-scroll rounded-3xl">
            {messageData[0].type == 'formMessage' ? (
              <FormMessageGroup
                formMessages={messageData as FormMessageType[]}
                isLast={isLast}
                key={`${skillLogId}${row}`}
              />
            ) : (
              messageData.map((message: PlainMessageType, col: number) =>
                transformMessage(message, isLast, `${skillLogId}${row}-${col}`),
              )
            )}
          </div>
        );
      } else {
        return transformMessage(messageData, isLast, `${skillLogId}${row}`);
      }
    })}
  </>
);
