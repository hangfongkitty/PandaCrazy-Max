/** A class that deals with the basic url object.
 * @class UrlClass
 * @author JohnnyRS - johnnyrs@allbyjohn.com */
class UrlClass {
	/**
 	 * @param  {string} thisUrl - The url string that is being used for this class.
	 */
	constructor(thisUrl) {
		this.url = thisUrl;
	}
	/** Gets the url being used by this class.
	 * @return {string} - The url string that this class is using. */
	returnUrl() { return this.url; }
	/** Fetches the url and handles mturk results.
	 * Detects json result and text result.
	 * @async - To wait for the responses to be received after a fetch. */
	async goFetch() {
		let returnValue = null;
		try {
			let response = await fetch(this.url, { credentials: `include` });
			let thisResult = "ok", dataType = "", theData=null;
			if (response.ok || response.status === 422 || response.status === 429 || response.status === 400 || response.status === 503) {
				// sorts response into json or text
				const type = response.headers.get('Content-Type');
				if (response.status === 400 || response.status === 503 ) thisResult = "bad.request";
				if (type.includes("application/json")) {
					theData = await response.json(); dataType = "json";
				}
				else {
					theData = await response.text(); dataType = "text";
				}
				returnValue = { type: `${thisResult}.${dataType}`, url: response.url, status: response.status, data: theData };
			} else {
				console.log("Fetch responses was not OK.");
				const type = response.headers.get('Content-Type'); console.log(type);
				if (type.includes("application/json")) console.log(await response.json());
				else console.log(await response.text());
				returnValue = { type: "unknown.result", url1: response.url, status: response.status, data: null };
			}
			response = theData = null;
		}
		catch (e) {
			console.log("Got an error when trying to fetch the url.");
			returnValue = { type: "caught.error", url: '', status: null, data: null };
		}
		return returnValue;
	}
}
