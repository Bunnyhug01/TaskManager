import React from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function TaskProgressBar(completion) {
  const now = completion.completionPercentage;
  return (
    <div>
      <ProgressBar animated striped variant="success" now={now} label={`${now}%`} />
    </div>
  )
}
