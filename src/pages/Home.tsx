import { Card } from "primereact/card";
import Charts from "../components/Charts";


const Home  = () =>{

return(
    <div className="flex flex-nowrap gap-5 mt-4">
        <Card className="w-100">
     <Charts/>
      </Card>
  <Card className="w-100">
     <Charts/>
     </Card>
     <Card className="w-100">
     <Charts/>
     </Card>
     <Card className="w-100">
     <Charts/>
     </Card>
    </div>
    
)

}

export default Home;