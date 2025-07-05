import sty from './spinner.module.css'


export const Spinner = ({ style }) => {
  return (
    <div className={sty.ellipsis} style={{ ...style }}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}