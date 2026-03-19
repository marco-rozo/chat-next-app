import { UserStatusEnum } from "@/src/core/enums/userStatus.enum";

interface ChatTitleProps {
    contactName: string;
    contactStatus: UserStatusEnum;
}

export function ChatTitle({ contactName, contactStatus }: ChatTitleProps) {
    return (
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">
                {contactName}
            </h3>
            {contactStatus === UserStatusEnum.ONLINE && (
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" title="Online"></span>
            )}
            {contactStatus === UserStatusEnum.OFFLINE && (
                <span className="h-2.5 w-2.5 rounded-full bg-gray-400" title="Offline"></span>
            )}
        </div>
    );
}
