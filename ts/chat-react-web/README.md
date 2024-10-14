# chat

Package for chat related components / hooks / contexts.

# Important files

- Using chat in another package use [ChatProvider](./src/context/ChatProvider.tsx)
- Rendering the chat messages use [ChatMessages](./src/components/ChatMessages/ChatMessages.tsx) (includes automod, booster request etc messages) or [ChatMessage](./src/components/ChatMessage/ChatMessage.tsx)
- Adding extra functionality (e.g. adding the booster request data) use [ChatAPIProvider](./src/context/ChatAPIProvider/ChatAPIProvider.tsx)

# Future Plan

In future, this will be used both in studio and platform, with as little difference as possible. All the chat logic from common-ui will be moved to this package
