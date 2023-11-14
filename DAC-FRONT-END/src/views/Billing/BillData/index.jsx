import { useEffect } from "react"


const BillData = ({property}) => {


    useEffect(() => {
      console.log("prop es ",property);
    

    }, [property])
    
  return (
    <div>{}</div>
  )
}

export default BillData