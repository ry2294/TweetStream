USE [TweetMap]
GO

/****** Object:  Table [dbo].[hashtagtoplace_tbl]    Script Date: 10/22/2015 6:01:22 PM ******/
DROP TABLE [dbo].[hashtagtoplace_tbl]
GO

/****** Object:  Table [dbo].[hashtagtoplace_tbl]    Script Date: 10/22/2015 6:01:22 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[hashtagtoplace_tbl](
	[hashTag] [varchar](max) NOT NULL,
	[placeId] [bigint] NOT NULL,
	[tweetCount] [bigint] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


