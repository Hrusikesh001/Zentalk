import { create } from 'zustand';

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

  messages: [],
  setMessages: (messages) => set({ messages }),

  findUsers: [],
  setFindUsers: (findUsers) => set({findUsers}),

  searchMessage: "",
  setSearchMessage: (searchMessage) => set({searchMessage}),

  selectedUsersId : [],
  setSelectedUsersId : (selectedUsersId) => set({selectedUsersId}),

  openGroupUsers : "",
  setOpenGroupUsers : (openGroupUsers) => set({openGroupUsers}),

  allGroups : [],
  setAllGroups : (allGroups) => set({allGroups}),

  groupMessages: [],
  setGroupMessages: (groupMessages) => set({groupMessages}),

  allFriends: [],
  setAllFriends: (allFriends) => set({allFriends}),

  typeOfCall : "",
  setTypeOfCall: (typeOfCall) => set({typeOfCall}),
}));

export default useConversation;
