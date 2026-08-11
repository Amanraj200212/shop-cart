import { createClient } from "next-sanity";

import {projectId,dataset, apiVersion} from '../sanity/env'


export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token:process.env.SANITY_API_TOKEN
})