import React from 'react'
import { Route } from 'react-router-dom'

import SectionScrollSection from '../SectionScrollSection'


const SectionScrollRouteSection = ({component:Component, ...rest}) => {
    return (
        <Route
            component={()=><SectionScrollSection><Component/></SectionScrollSection>}
            {...rest}
        />
    )
}

export default SectionScrollRouteSection
