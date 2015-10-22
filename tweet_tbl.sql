USE [TweetMap]
GO

/****** Object:  Table [dbo].[tweet_tbl]    Script Date: 10/22/2015 6:02:33 PM ******/
DROP TABLE [dbo].[tweet_tbl]
GO

/****** Object:  Table [dbo].[tweet_tbl]    Script Date: 10/22/2015 6:02:33 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[tweet_tbl](
	[tweetId] [varchar](max) NOT NULL,
	[text] [nvarchar](max) NOT NULL,
	[createdTime] [datetime] NOT NULL,
	[placeId] [bigint] NOT NULL,
	[hashTag] [varchar](max) NOT NULL,
	[userName] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


