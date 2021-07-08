import React from 'react'

export default function LoadingCircle() {
    return (
        <div className={'loading-container'} style={{ color: 'black' }}>
            <div className="spinner-border text-dark" role="status" />
            <span>{'Loading...'}</span>
        </div>
    )
}
