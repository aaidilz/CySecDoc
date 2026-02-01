import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const createSlug = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

export async function GET() {
  const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const slug = createSlug(body.title);
  const { data, error } = await supabase.from('blogs').insert([{ ...body, slug }]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...updateData } = body;
  if (updateData.title) updateData.slug = createSlug(updateData.title);
  const { data, error } = await supabase.from('blogs').update(updateData).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}