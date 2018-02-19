import React from 'react'
import connect from "react-redux/es/connect/connect";
import {dataModalOpen} from "../../sagas/actions";

const mapStateToProps = (state, ownProps) => {
    return {
        open: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.modal.open,
        payload: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.modal.payload,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        close: () => dispatch(dataModalOpen(false))
    }
}

const ModalHandlerRepresentation = ({reqModal:ReqModal, open, close, payload, ...rest}) => {
    return (
        <ReqModal open={open} close={close} payload={payload} {...rest}/>
    )
}

const ModalHandler = connect(mapStateToProps, mapDispatchToProps)(ModalHandlerRepresentation)

export default ModalHandler