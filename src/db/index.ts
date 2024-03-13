import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

export const uploadFile = async (fileName: string, file: File) => {
	const { data, error } = await supabase.storage
		.from('tickets')
		.upload(fileName, file)

	if (error) {
		console.error(error)
		throw new Error(error.message)
	}

	return data?.path
}
