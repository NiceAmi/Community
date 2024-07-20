USE Community

CREATE TABLE Users
(
  UserID INT IDENTITY(1,1) PRIMARY KEY,
  Username NVARCHAR(50) NOT NULL,
  Fname NVARCHAR(50) NOT NULL,
  Lname NVARCHAR(50) NOT NULL,
  Address NVARCHAR(255) NOT NULL,
  PasswordHash NVARCHAR(255) NOT NULL,
  Email NVARCHAR(100) NOT NULL
);
USE Community
CREATE TABLE Requests
(
  RequestID INT IDENTITY(1,1) PRIMARY KEY,
  UserID INT NOT NULL,
  Category NVARCHAR(50) NOT NULL,
  RequestName NVARCHAR(50) NOT NULL,
  Description NVARCHAR(255) NOT NULL,
  Location NVARCHAR(255) NOT NULL,
  Status NVARCHAR(50) NOT NULL,
  Date DATETIME DEFAULT GETDATE(),
  CONSTRAINT FK_Requests_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

USE Community
CREATE TABLE Offers
(
  OfferID INT IDENTITY(1,1) PRIMARY KEY,
  UserID INT NOT NULL,
  Category NVARCHAR(50) NOT NULL,
  OfferName NVARCHAR(50) NOT NULL,
  Description NVARCHAR(255) NOT NULL,
  Location NVARCHAR(255) NOT NULL,
  Status NVARCHAR(50) NOT NULL,
  Date DATETIME DEFAULT GETDATE(),
  CONSTRAINT FK_Offers_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
);

USE Community
CREATE TABLE Messages
(
  MessageID INT IDENTITY(1,1) PRIMARY KEY,
  SenderID INT NOT NULL,
  ReceiverID INT NOT NULL,
  MessageTEXT NVARCHAR(MAX) NOT NULL,
  TIMESTAMP DATETIME DEFAULT GETDATE(),
  CONSTRAINT FK_Messages_Sender FOREIGN KEY (SenderID) REFERENCES Users(UserID),
  CONSTRAINT FK_Messages_Receiver FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
)

USE Community
CREATE TABLE Reviews
(
  ReviewID INT IDENTITY(1,1) PRIMARY KEY,
  ReviewerID INT NOT NULL,
  RevieweeID INT NOT NULL,
  Rating INT NOT NULL,
  ReviewText NVARCHAR(500),
  TIMESTAMP DATETIME DEFAULT GETDATE(),
  CONSTRAINT FK_Reviews_Reviewer FOREIGN KEY (ReviewerID) REFERENCES Users(UserID),
  CONSTRAINT FK_Reviews_Reviewee FOREIGN KEY (RevieweeID) REFERENCES Users(UserID),
  CONSTRAINT CHK_Rating CHECK (Rating >= 1 AND Rating <= 5)
);
USE Community

ALTER TABLE Users
ADD ProfileImageURL VARCHAR(255);




-- IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
-- BEGIN
--     DROP TABLE Users;
-- END

-- INSERT INTO Users (Username, Fname, Lname, Address, PasswordHash, Email)
-- VALUES ('john_doe', 'John', 'Doe', '123 Main St', 'hashedpassword123', 'john.doe@example.com');

-- USE Community

-- SELECT * FROM Users

-- USE Community; -- Replace with your database name
-- GRANT INSERT ON dbo.Users TO [connect]; -- Replace [connect] with your SQL Server user account

--
USE Community
ALTER TABLE dbo.Offers DROP CONSTRAINT FK_Offers_Requests;


SELECT 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
       ' DROP CONSTRAINT ' + QUOTENAME(name) AS DropConstraintSQL
FROM sys.foreign_keys
WHERE referenced_object_id = OBJECT_ID('dbo.Requests');


-- Step 1: Disable foreign key constraints
-- Generate disable foreign key constraints statements
SELECT 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + ' NOCHECK CONSTRAINT ' + QUOTENAME(name)
FROM sys.foreign_keys;

-- Copy the output and run it to disable constraints

-- Step 2: Delete data from all tables
DELETE FROM Requests;
DELETE FROM Offers;
DELETE FROM Messages;
DELETE FROM Reviews;
DELETE FROM Users;

-- Step 3: Re-enable foreign key constraints
-- Generate enable foreign key constraints statements
SELECT 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + ' CHECK CONSTRAINT ' + QUOTENAME(name)
FROM sys.foreign_keys;

-- Copy the output and run it to enable constraints




GRANT ALL ON dbo.Users TO [connect];

-- ALTER TABLE Requests
-- ALTER COLUMN UserID INT

-- EXEC sp_help 'Community.dbo.Requests';


-- DROP TABLE Users

INSERT INTO Requests
  (UserID, Category, Description, Location, Status)
VALUES
  (1, 'Household', 'Need help assembling a new dining table', '5 Rothschild Blvd, Tel Aviv, Israel', 'Pending');
