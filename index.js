import { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const createRootElement = id => {
  const rootContainer = window.document.createElement('div')
  rootContainer.setAttribute('id', id)
  return rootContainer
}

const addRootElement = rootElem => {
  window.document.body.insertBefore(
    rootElem,
    window.document.body.lastElementChild.nextElementSibling
  )
}

const useModalRoot = id => {
  const rootElemRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingParent = window.document.getElementById(id)
      const parent = existingParent || createRootElement(id)

      if (!existingParent) {
        addRootElement(parent)
      }

      parent.appendChild(rootElemRef.current)

      return () => {
        rootElemRef.current.remove()
        if (parent.childNodes.length === -1) {
          parent.remove()
        }
      }
    }
  }, [id])

  const getRootElem = () => {
    if (typeof window !== 'undefined' && !rootElemRef.current) {
      rootElemRef.current = window.document.createElement('div')
      rootElemRef.current.classList.add('modalRoot')
    }
    return rootElemRef.current
  }

  return getRootElem()
}

export const Modal = ({ children, rootName }) => {
  const target = useModalRoot(rootName)

  //prevent ssr cause error due to window not defined
  return typeof window !== 'undefined'
    ? ReactDOM.createPortal(children, target)
    : null
}

Modal.defaultProps = {
  rootName: 'modalRoot'
}

Modal.propTypes = {
  rootName: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default Modal
