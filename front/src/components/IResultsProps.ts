export interface IResultsProps {
    messages?: string[]
    innerHeaders?: {
        [key: string]: string
    }
    innerRequestBody?: string
    fetchUrl?:string
}