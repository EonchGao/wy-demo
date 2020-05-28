import { createReducer, on, Action } from '@ngrx/store';
import { SetModalVisible, SetModalType, SetUserId, SetShareInfo, SetLikeId } from '../actions/member.action';


export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}


export interface ShareInfo {
  id: string;
  type: string;
  txt: string;
}

export interface MemberState {
  modalVisible: boolean;
  modalType: ModalTypes;
  userId: string;
  likeId: string;
  shareInfo?: ShareInfo;
}


export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
  userId: '',
  likeId: ''
};

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
  on(SetModalType, (state, { modalType }) => ({ ...state,  modalType })),
  on(SetUserId, (state, { id }) => ({ ...state,  userId: id })),
  on(SetLikeId, (state, { id }) => ({ ...state,  likeId: id })),
  on(SetShareInfo, (state, { info }) => ({ ...state,  shareInfo: info }))
);

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}