import { UserInterface } from '../interfaces';

enum USER_ROLES {
  GUEST = 'guest',
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
};

export enum ACTIONS {
  Create = 'create',
  Edit = 'edit',
  Delete = 'delete',
}

export function can(user: UserInterface, modelName: string, action: ACTIONS, object: any = {}): boolean {
  switch (user.roles) {
    case USER_ROLES.ADMIN:
      return true;
    case USER_ROLES.MANAGER:
      if (modelName == 'Course') {
        return true;
      }
      // same roles for User
    case USER_ROLES.USER:
      if (modelName == 'Course') {
        if (action == ACTIONS.Create) {
          return true;
        } else {
          console.log('res=' + (object.ownerId.toString() == user._id.toString()));

          return (object.ownerId.toString() == user._id.toString())
        }
      }
      break;
    //case USER_ROLES.GUEST:
    default:
      return false;
  }
  return false;
}
