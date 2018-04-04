var cheerio = require("cheerio");
var async = require("async");
var url = require("url");

module.exports = function(input,meta,output){

	if (typeof(input)=='string'){
		var $ = cheerio.load(input);
		var result=[];
		$(meta.node).each(function(i){

			if (meta.limit && i>=meta.limit){
				return;
			}

			if (meta.value){
				if (meta.resolveUrl){
					result.push(url.resolve(meta.resolveUrl,$(this)[meta.method](meta.value)))
				}
				else {
					result.push($(this)[meta.method](meta.value))
				}
			}
			else {
				result.push($(this)[meta.method]())
			}
		})

		// console.log($(meta.node),result)
		output(result);
	}
	else {
		var result=[];
		async.each(input,function(body,parseDone){
			var $ = cheerio.load(body);
			$(meta.node).each(function(i){

				if (meta.limit && i>=meta.limit){
					return;
				}

				if (meta.value){
					if (meta.resolveUrl){
						result.push(url.resolve(meta.resolveUrl,$(this)[meta.method](meta.value)))
					}
					else {
						result.push($(this)[meta.method](meta.value))
					}
				}
				else {
					result.push($(this)[meta.method]())
				}
			})
			parseDone();
		},function(err){
			if (err){
				console.log(err)
				output(false)
			}
			else {
				// console.log(result);
				output(result)
			}
		})
	}
	
}