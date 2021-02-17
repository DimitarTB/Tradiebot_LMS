import React from "react"

import React from 'react'

function Downloader() {

    

    return (
        <div>
            
        </div>
    )
}

export default Downloader



class  extends React.Component {
    downloadTxtFile = () => {
      const element = document.createElement("a");
      const file = new Blob([document.getElementById('input').value],    
                  {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = "myFile.txt";
      document.body.appendChild(element);
      element.click();
    }
    render() {
      return (
       <div>
         <input id="input" />
         <button onClick={this.downloadTxtFile}>Download</button>  
        </div>
      );
     }
   }