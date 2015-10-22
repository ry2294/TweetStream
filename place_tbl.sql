USE [TweetMap]
GO

/****** Object:  Table [dbo].[place_tbl]    Script Date: 10/22/2015 6:02:00 PM ******/
DROP TABLE [dbo].[place_tbl]
GO

/****** Object:  Table [dbo].[place_tbl]    Script Date: 10/22/2015 6:02:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[place_tbl](
	[placeId] [bigint] IDENTITY(1,1) NOT NULL,
	[id] [varchar](max) NOT NULL,
	[city] [varchar](max) NOT NULL,
	[countryCode] [varchar](max) NOT NULL,
	[country] [varchar](max) NOT NULL,
	[coord_xx] [varchar](max) NOT NULL,
	[coord_xy] [varchar](max) NOT NULL,
	[coord_yx] [varchar](max) NOT NULL,
	[coord_yy] [varchar](max) NOT NULL,
	[tweetCount] [bigint] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


