# social

Package for social related components / hooks / contexts.

# Important files

- For adding friend request mutation, use the hooks to get all the mutation updates just work out of the box
  - [Accept friend request](./src/hooks/useAcceptFriendRequestMutation.hook.ts)
  - [Block user](./src/hooks/useBlockUserMutation.hook.ts)
  - [Remove friend](./src/hooks/useRemoveFriendMutation.hook.ts)
  - [Remove friend request](./src/hooks/useRemoveFriendRequestMutation.hook.ts)
  - [Send friend request](./src/hooks/useSendFriendRequestMutation.hook.ts)
  - [Unblock user](./src/hooks/useUnblockUserMutation.hook.ts)
- Some components (e.g. [MiniProfile](./src/components/MiniProfile/)) requires [SocialPackageProvider](./src/context/SocialPackageProvider.tsx)
- Adding extra functionality (e.g. listening when user has blocked another user) use [SocialPackageProvider](./src/context/SocialPackageProvider.tsx)
