import React from 'react'
import * as _ from "lodash";
import styled from 'styled-components'

const StyledCheckbox = styled.input`
    position: absolute;
    z-index:-1;
    opacity: 0;
    & + label {
    position: relative;
    cursor: pointer;
    ${props => props.reverse ? 'padding-right: 18px;': 'padding-left:18px;'}
  }

  // Box.
  & + label:before {
    position: absolute;
    top: 50%;
    ${props => props.reverse ? 'right: 0;': 'left: 0;'}
    transform: translate(0%, -50%);
    content: '';
    display: inline-block;
    vertical-align: text-top;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: white;
  }

  // Box hover
  &:hover + label:before {
    background: #f35429;
  }
  
  // Box focus
  &:focus + label:before {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
  }

  // Box checked
  &:checked + label:before {
    background: #f35429;
  }
  
  // Disabled state label.
  &:disabled + label {
    color: #b8b8b8;
    cursor: auto;
  }

  // Disabled box.
  &:disabled + label:before {
    box-shadow: none;
    background: #ddd;
  }

  // Checkmark. Could be replaced with an image
  &:checked + label:after {
    content: '';
    position: absolute;
    ${props => props.reverse ? 'right: 9px;': 'left: 1px;'}
    top: 9px;
    background: white;
    width: 2px;
    height: 2px;
    box-shadow: 
      2px 0 0 white,
      4px 0 0 white,
      4px -2px 0 white,
      4px -4px 0 white,
      4px -6px 0 white,
      4px -8px 0 white;
    transform: rotate(45deg);
  }
`

export default class Checkbox extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            checked: this.props.checked || false
        }
        this.handleContainerClick = this.handleContainerClick.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleInputClick = this.handleInputClick.bind(this)
        this.computeTabIndex = this.computeTabIndex.bind(this)
        this.canToggle = this.canToggle.bind(this)

    }

    handleContainerClick = (e) => {
        this.handleClick(e)
    }

    handleInputClick = (e) => {
        this.handleClick(e)
    }

    canToggle = () => {
        const { disabled, readOnly } = this.props
        const { checked } = this.state

        return !disabled && !readOnly
    }
    computeTabIndex = () => {
        const { disabled, tabIndex } = this.props

        if (!_.isNil(tabIndex)) return tabIndex
        return disabled ? -1 : 0
    }
    handleClick = (e) => {
        const { checked } = this.state

        if (!this.canToggle()) return

        _.invoke(this.props, 'onClick', e, { ...this.props, checked: !checked})
        _.invoke(this.props, 'onChange', e, { ...this.props, checked: !checked})

        this.setState({ checked: !checked})
    }


    render(){
        const {
            className,
            disabled,
            label,
            id,
            name,
            type,
            value,
            reverse,
            children
        } = this.props
        const { checked } = this.state
        return(
            <span
                className={className}
                onClick={this.handleContainerClick}
                onChange={this.handleContainerClick}
                onMouseDown={this.handleMouseDown}
            >
                <StyledCheckbox
                    checked={checked}
                    id={id}
                    name={name}
                    reverse={reverse}
                    onClick={this.handleInputClick}
                    readOnly
                    ref={this.handleInputRef}
                    tabIndex={this.computeTabIndex()}
                    type={type || 'checkbox'}
                />
                <label htmlFor={id}>
                    {children || label}
                </label>

            </span>
        )
    }
}