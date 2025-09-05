import { useState, useRef, useEffect } from 'react';
import Airtable from "airtable";

interface ApplicantSearchInputProps {
    rusheeName: string;
    setRusheeName: (rusheeName: string) => void;
    applicants: string[];
}

export function ApplicantSearchInput({ rusheeName, setRusheeName, applicants }: ApplicantSearchInputProps) {
    // pat5MZBuJCCU105MQ.8bcbff2a02b3a16fd465d2f1a152f87d96164ebaf598fbe689eac8bb746a4d2f
    /*
    useEffect(() => {
        var Airtable = require('airtable');
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: 'pat5MZBuJCCU105MQ.8bcbff2a02b3a16fd465d2f1a152f87d96164ebaf598fbe689eac8bb746a4d2f'
        });
        const base = Airtable.base('appEmD27JyhYr4osO');
    }, []);
    */
    //const [applicants, setApplicants] = useState<string[]>([]);
    const [value, setValue] = useState("");
    
    // filter applicants based on `value`:
    const filtered = applicants.filter(
      app => app.toLowerCase().includes(value.toLowerCase())
    );
    /*
    useEffect(() => {
        
        async function fetchData() {
            try {
                const res = await fetch('https://api.airtable.com/v0/appEmD27JyhYr4osO/Applicants', {
                    headers: { Authorization: `Bearer pat5MZBuJCCU105MQ.8bcbff2a02b3a16fd465d2f1a152f87d96164ebaf598fbe689eac8bb746a4d2f` }     
                })
                const data = await res.json();
                console.log(data.records);

                const applications = data.records;

                const names = applications
                    .map((app: any) => app.fields.applicant_name)
                    .filter((name: any) => typeof name === "string");

                setApplicants(names);
                } catch (err) {
                console.error("Error fetching data", err);
                }
            }

            fetchData();
            }, []);*/
    
    return (
        <div>
            <div className="input-section">
                <label htmlFor="rushee-name" className="input-label">
                Rushee Name:
                </label>
                <input
                    id="rushee-name"
                    type="text"
                    value={rusheeName}
                    onChange={(e) => setRusheeName(e.target.value)}
                    placeholder="Enter rushee name"
                    className="rushee-input"
                    list="applicants"
                />
                <datalist id = "applicants">
                    {filtered.map(opt => (
                        <option key={opt} value={opt} />
                    ))}
                </datalist>
            </div>
        </div>
    );
};