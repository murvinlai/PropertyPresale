import * as cheerio from "cheerio";

interface BCFSAResult {
    isValid: boolean;
    details?: {
        name: string;
        licenseStatus: string;
        brokerage?: string;
    };
    error?: string;
}

export async function verifyRealtor(licenseNumber: string, inputName: string): Promise<BCFSAResult> {
    try {
        const url = `https://www.bcfsa.ca/re-licencee/${licenseNumber}`;
        const response = await fetch(url);

        if (response.status === 404) {
            return { isValid: false, error: "License number not found" };
        }

        if (!response.ok) {
            return { isValid: false, error: `BCFSA Error: ${response.statusText}` };
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Name: Found in h2.text-h2-alt based on HTML analysis
        let officialName = $("h2.text-h2-alt").first().text().trim();

        // Fallback
        if (!officialName) {
            officialName = $(".g-teaser__title").first().text().trim();
        }
        // Last resort fallback to h1 but ignore if it is the generic title
        if (!officialName) {
            const h1 = $("h1").first().text().trim();
            if (h1 && h1 !== "Real Estate Professional Information") {
                officialName = h1;
            }
        }

        // License Status, Brokerage, and Known As in <dl>
        let licenseStatus = "Unknown";
        let brokerage = "";
        let knownAs = "";

        $("dt").each((_, el) => {
            const label = $(el).text().trim().replace(":", "");
            const value = $(el).next("dd").text().trim();

            if (label === "Licence Status") {
                licenseStatus = value;
            }
            if (label === "Business Name") {
                brokerage = value;
            }
            if (label === "Known As") {
                knownAs = value;
            }
        });

        if (!officialName) {
            return { isValid: false, error: "Could not parse realtor name from BCFSA" };
        }

        // Check Status (must be Licensed)
        const isActive = licenseStatus.toLowerCase().includes("licensed");

        if (!isActive) {
            // Generic error for status issues
            return {
                isValid: false,
                error: "License is not active or not found."
            };
        }

        // Fuzzy Matching Logic
        // Match against Official Name OR Known As
        const isOfficialMatch = checkNameMatch(inputName, officialName);
        const isAliasMatch = knownAs ? checkNameMatch(inputName, knownAs) : false;

        if (!isOfficialMatch && !isAliasMatch) {
            // Generic error for name mismatch
            return {
                isValid: false,
                error: "Name does not match our records for this license."
            };
        }

        return {
            isValid: true,
            details: {
                name: officialName, // Always return official name for records
                licenseStatus,
                brokerage
            }
        };

    } catch (err: any) {
        console.error("BCFSA Verification Error:", err);
        return { isValid: false, error: "Verification service unavailable." };
    }
}

function checkNameMatch(input: string, official: string): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

    const inputClean = normalize(input);
    const officialClean = normalize(official);

    // 1. Direct match
    if (officialClean === inputClean) return true;
    if (officialClean.includes(inputClean)) return true;

    // 2. Token match
    const inputTokens = inputClean.split(/\s+/).filter(t => t.length > 1);
    const officialTokens = officialClean.split(/\s+/);

    const allTokensMatch = inputTokens.every(token => officialTokens.includes(token));

    return allTokensMatch;
}
