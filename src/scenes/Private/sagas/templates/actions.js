import * as actionType from './types'

export const fetchTemplatesThumbnails = () => {
    return {
        type: actionType.TEMPLATES_THUMBNAILS_FETCH_REQUEST
    }
}
