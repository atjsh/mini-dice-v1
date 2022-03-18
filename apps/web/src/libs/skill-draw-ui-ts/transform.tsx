import {
  MessageResponseType,
  UserActivityMessage,
  PlainMessage,
  LinkGroupMessage,
  LinkGroupType,
  FormMessage,
  FormMessageType
} from ".";

export function transformSkillLogToMessage(
  skillLog: MessageResponseType,
  isLast: boolean,
  skillLogId: string
) {
  return {
    userActivityMessage: (
      <UserActivityMessage userActivityMessage={skillLog.userRequestDrawings} />
    ),
    serverMessage: skillLog.actionResultDrawings.map((ard, index) => {
      if (Array.isArray(ard)) {
      } else {
        if (ard.type == "plainMessage") {
          return (
            <PlainMessage plainMessage={ard} key={`${skillLogId}${index}`} />
          );
        } else if (ard.type == "linkGroup") {
          return (
            <div className="overflow-x-auto">
              <LinkGroupMessage
                linkGroup={ard as LinkGroupType}
                isAvailable={isLast}
                key={`${skillLogId}${index}`}
              />
            </div>
          );
        } else if (ard.type == "formMessage") {
          return (
            <div className="overflow-x-auto">
              <FormMessage
                form={ard as FormMessageType}
                isAvailable={isLast}
                key={`${skillLogId}${index}`}
              />
            </div>
          );
        }
      }
      return <div></div>;
    }),
    time: (
      <div className="text-gray-400 font-bold text-xs pl-2">
        {new Date(skillLog.date).toLocaleString("ko-kr")}
      </div>
    )
  };
}
