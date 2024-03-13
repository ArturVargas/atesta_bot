import { createClient } from '@supabase/supabase-js'
import { Bucket } from '../types/buckets'

const endpoint = process.env.SUPABASE_URL!

// Create a single supabase client for interacting with your database
export const supabase = createClient(endpoint, process.env.SUPABASE_KEY!)


/**
	* Creates a new asset in the specified bucket. 
	*
	* @param bucket - Bucket name 
	* @param fileName - The name of the file 
	* @param fileBlob - The actual file in Blob format
	* @returns The newly created asset url
*/
export const uploadFile = async (bucket: Bucket, fileName: string, fileBlob: Blob) => {
	const file = new File([fileBlob], fileName, {
		type: 'image/jpeg',
		lastModified: Date.now()
	})

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(fileName, file)

	if (error) {
		console.error(error)
		throw new Error(error.message)
	}

	return `${endpoint}/storage/v1/object/public/${bucket}/${data.path}`
}
