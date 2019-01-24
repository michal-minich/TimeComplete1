CREATE TABLE [Token](
  [Id] INT PRIMARY KEY NOT NULL, 
  [Value] TEXT NOT NULL, 
  [ValidAfter] DATETIME NOT NULL, 
  [ValidBefore] DATETIME);

CREATE TABLE [Client](
  [Id] INT PRIMARY KEY NOT NULL, 
  [TokenId] INT NOT NULL REFERENCES [Token]([Id]));

CREATE TABLE [Password](
  [Id] INT PRIMARY KEY NOT NULL, 
  [HashedValue] TEXT NOT NULL, 
  [Salt] TEXT NOT NULL);

CREATE TABLE [User](
  [Id] INT PRIMARY KEY NOT NULL, 
  [Email] TEXT NOT NULL, 
  [PasswordId] INT NOT NULL REFERENCES [Password]([Id]), 
  [RegistredOn] DATETIME NOT NULL, 
  [IsEmailConfirmed] BOOL NOT NULL);

CREATE TABLE [Event](
  [Id] INT PRIMARY KEY NOT NULL, 
  [Name] TEXT NOT NULL, 
  [ClientGeneratedOn] DATETIME NOT NULL, 
  [ReceivedOn] DATETIME NOT NULL, 
  [Data] TEXT NOT NULL, 
  [ClientEventId] INT NOT NULL, 
  [UserId] INT NOT NULL REFERENCES [User]([Id]), 
  [ClientId] INT NOT NULL REFERENCES [Client]([Id]));

CREATE TABLE [UserAuth](
  [Id] INT PRIMARY KEY NOT NULL, 
  [UserId] INT NOT NULL REFERENCES [User]([Id]), 
  [ClientId] INT NOT NULL REFERENCES [Client]([Id]), 
  [TokenId] INT NOT NULL REFERENCES [Token]([Id]), 
  UNIQUE([UserId], [ClientId]));

CREATE TABLE [UserEmailConfirm](
  [Id] INT PRIMARY KEY NOT NULL, 
  [UserId] NOT NULL REFERENCES [User]([Id]), 
  [TokenId] INT NOT NULL REFERENCES [Token]([Id]));

