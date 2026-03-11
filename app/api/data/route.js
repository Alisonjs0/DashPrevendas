import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('dashClientes')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Normalize: map Historico_tarefa -> Historico so the frontend keeps working
        const normalized = (data || []).map(row => ({
            ...row,
            Historico: row['Historico_tarefa'] ?? row['Historico'] ?? null,
        }));

        return NextResponse.json(normalized);
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (Array.isArray(body)) {
            // Upsert all rows (expects each row to have an `id` for conflict resolution)
            const { error } = await supabase
                .from('dashClientes')
                .upsert(body, { onConflict: 'id' });

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ message: 'Data updated successfully', count: body.length });
        } else if (typeof body === 'object') {
            const { error } = await supabase.from('dashClientes').insert(body);
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            return NextResponse.json({ message: 'Row inserted successfully' });
        }

        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    } catch (err) {
        console.error('POST error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
