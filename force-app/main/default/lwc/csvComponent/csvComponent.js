import { LightningElement, wire } from 'lwc';
import fetchAccountRecords from '@salesforce/apex/AccountController.fetchAccountRecords';
const columns = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
];
export default class CsvComponent extends LightningElement {
  columns=columns;
  accountRecord=[];
  @wire(fetchAccountRecords) wiredAccountRecords({data,error}){
    if(data){
      this.accountRecord=data;
      console.log('Account Records',this.accountRecord)
    }else if(error){
      console.log('Error',error)
    }
  }

  get checkRecords(){
    return this.accountRecord> 0 ? true : false;
  }

  clickHandler(){
    //Records are selected in datatable
    let selectedRows=[];
    let downloadRecords=[];
    selectedRows=this.template.querySelector('lightning-datatable').getSelectedRows();
    
    //In case records are not selected, download all the records on table
    if(selectedRows.length>0){
      downloadRecords=[...selectedRows];
    }else {
      downloadRecords=[...this.accountRecord];
    }

    console.log('downloadRecords',downloadRecords);
    //Convert array into CSV
    let csvFileDownload=this.convertArraytoCsv(downloadRecords);
    this.createLinkForDownload(csvFileDownload);
  }

  convertArraytoCsv(downloadRecords){
    //let csvHeader =Object.keys(downloadRecords[0]).toString();
    console.log('Convert Array');
    let csvHeader='';
    let csvHeaderArray=[];
    csvHeaderArray.push('Id');
    this.columns.forEach(currItem => {
      csvHeaderArray.push(currItem.label);
    });
    csvHeader=csvHeaderArray.toString();
    let csvBody=downloadRecords.map(currItem=>Object.values(currItem).toString());
    console.log('csvHeader',csvHeader);
    console.log('csvBody',csvBody);

    let csvFile=csvHeader+'\n'+csvBody.join('\n');
    return csvFile;


  }

  createLinkForDownload(csvFileDownload){
    const downLink=document.createElement('a');
    console.log('In createLinkForDownload')
    downLink.href='data:text/csv;charset=utf-8,'+encodeURI(csvFileDownload);
    downLink.target='_blank';
    downLink.download='Account_Data.csv';
    downLink.click();
    
  }

}