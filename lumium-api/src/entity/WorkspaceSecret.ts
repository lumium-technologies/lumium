import { Column, Entity, ManyToOne } from "typeorm"
import { WorkspaceSecretDTO } from "../../types/api/v1/response/WorkspaceSecretDTO"
import { AbstractEntity } from "./AbstractEntity"
import { User } from "./User"
import { Workspace } from "./Workspace"

@Entity("workspace_secrets")
export class WorkspaceSecret extends AbstractEntity {
    @ManyToOne(() => User, (user) => user.auth)
    user: User

    @ManyToOne(() => Workspace, (workspace) => workspace.secrets)
    workspace: Workspace

    @Column()
    secret: string
}

export const mapToDTO = (entity: WorkspaceSecret) => {
    let dto: WorkspaceSecretDTO = {
        userId: entity.user?.id,
        workspaceId: entity.workspace?.id,
        secret: entity.secret,
        id: entity.id,
        createdAt: entity.createdAt?.toString(),
        updatedAt: entity.updatedAt?.toString(),
        deletedAt: entity.deletedAt?.toString(),
        version: entity.version
    };
    return dto;
};
