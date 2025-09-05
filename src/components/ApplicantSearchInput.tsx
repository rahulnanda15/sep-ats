import { useState, useRef, useEffect } from 'react';
import Airtable from "airtable";

interface ApplicantSearchInputProps {
    rusheeName: string;
    setRusheeName: (rusheeName: string) => void;
    applicants: string[];
}

export function ApplicantSearchInput({ rusheeName, setRusheeName, applicants }: ApplicantSearchInputProps) {
    
    const [value, setValue] = useState("");
    
    // filter applicants based on `value`:
    const filtered = applicants.filter(
      app => app.toLowerCase().includes(value.toLowerCase())
    );
    
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
