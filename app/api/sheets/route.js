import Papa from 'papaparse';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sheetUrl = searchParams.get('url');

    if (!sheetUrl) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Smart URL conversion: Try to convert sharing/edit URLs to CSV export URLs
    let fetchUrl = sheetUrl;
    if (sheetUrl.includes('docs.google.com/spreadsheets/d/')) {
        const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
            const sheetId = match[1];
            // Check if it's already an export or pub link to avoid breaking valid ones
            if (!sheetUrl.includes('/pub') && !sheetUrl.includes('/export')) {
                fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
            }
        }
    }

    try {
        console.log("Fetching sheet from URL:", fetchUrl);
        const response = await fetch(fetchUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
        }

        const csvText = await response.text();

        const { data, errors } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        if (errors.length > 0) {
            console.warn('CSV Parsing errors:', errors);
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching sheet:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
