import React from 'react'

/* COMPONENT */
import Sheet from '../Sheet'
import FullPage from '../../../../../../components/Layout/FullPage'
import PaddedContainer from '../PaddedContainer'
import Meta from '../Meta'

const DataConfigView = () => {
    return (
        <PaddedContainer>
            <FullPage>
                <Sheet width={800} height={500}/>
                <Meta/>
            </FullPage>
        </PaddedContainer>
    )
}

export default DataConfigView
