-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
DROP PROCEDURE insertTweet
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE insertTweet (
@tweetId varchar(max),
@text nvarchar(max),
@hashTag varchar(max),
@userName varchar(max),
@place_id varchar(max),
@city varchar(max),
@countryCode varchar(max),
@country varchar(max),
@coord_xx varchar(max),
@coord_xy varchar(max),
@coord_yx varchar(max),
@coord_yy varchar(max)
)
AS
BEGIN
	IF not exists(select 1 from place_tbl where id = @place_id)
		BEGIN
			insert into place_tbl (id, city, countryCode, country, coord_xx, coord_xy, coord_yx, coord_yy, tweetCount)
			values(@place_id, @city, @countryCode, @country, @coord_xx, @coord_xy, @coord_yx, @coord_yy, 0);
		END
	
	DECLARE @placeId bigint
	DECLARE @placeTweetCount bigint
	select @placeId = placeId, @placeTweetCount = tweetCount from place_tbl where id = @place_id;

	IF exists(select 1 from place_tbl where id = @place_id)
		BEGIN

			update place_tbl
			set tweetCount = (@placeTweetCount + 1)
			where placeId = @placeId

			insert into tweet_tbl (tweetId, text, createdTime, placeId, hashTag, userName) 
			values(@tweetId, @text, GETDATE(), @placeId, @hashTag, @userName);

			IF NOT EXISTS(select 1 from hashtagtoplace_tbl where hashTag = @hashTag and placeId = @placeId)
				begin
					insert into hashtagtoplace_tbl(hashTag, placeId, tweetCount)
					values(@hashTag, @placeId, 0)
				end

			DECLARE @hashTagPlaceTweetCount bigint
			select @hashTagPlaceTweetCount = tweetCount from hashtagtoplace_tbl where hashTag = @hashTag and placeId = @placeId

			update hashtagtoplace_tbl
			set tweetCount = (@hashTagPlaceTweetCount + 1)
			where hashTag = @hashTag and placeId = @placeId

			select @tweetId, @hashTag, @userName, @place_id, @city, @countryCode, 
			@country, @coord_xx, @coord_xy, @coord_yx, @coord_yy, @text

		END
END
GO