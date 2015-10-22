USE [TweetMap]
GO

DECLARE	@return_value int

EXEC	@return_value = [dbo].[insertTweet]
		@tweetId = '656186848604196864',
		@hashTag = 'Forchheim',
		@userName = 'kartenquiz.de',
		@place_id = '753443fe7a02b2fe',
		@city = 'Forchheim',
		@countryCode = 'DE',
		@country = 'Deutschland',
		@coord_type = '',
		@coord_xx = '',
		@coord_xy = '',
		@coord_yx = '',
		@coord_yy = ''

SELECT	'Return Value' = @return_value

GO
