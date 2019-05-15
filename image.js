
    //debugger;
    var imagesFiles = document.getElementById("imagesss");
    var max_width = 600;
    var max_height = 400;
    var imageError = document.getElementById("image_error");
    
  imagesFiles.addEventListener("change", imagePreviewing);
      
    
    
  var preview = document.getElementById('preview');

  var form = document.getElementById('form');

  function processfile(file) {
    
      if( !( /image/i ).test( file.type ) )
        {
          imageError.textContent =  "File "+ file.name +" is not an image." ;
          imageError.style.color =  "red" ;
            return false;
        }
        // else{
        //   imageError.textContent =  "" ;
        // }

      // read the files
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      
      reader.onload = function (event) {
        
        // blob stuff
        var blob = new Blob([event.target.result]); // create blob...
        
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL
        
        // helper Image object
        var image = new Image();
        image.src = blobURL;
        //
        //preview.appendChild(image); // preview commented out, I am using the canvas instead
        image.onload = function() {
          // have to wait till it's loaded
          var resized = resizeMe(image);
          
          var newinput = document.createElement("input");
          newinput.type = 'hidden';
          newinput.name = 'images[]';
          newinput.value = resized; // put result from canvas into new hidden input
          
          form.appendChild(newinput);
        }
      };
  }

  function readfiles(files) {
    
      // remove the existing canvases and hidden inputs if user re-selects new pics
      var existinginputs = document.getElementsByName('images[]');
      var existingcanvases = document.getElementsByTagName('canvas');
      while (existinginputs.length > 0) { // it's a live list so removing the first element each time
        // DOMNode.prototype.remove = function() {this.parentNode.removeChild(this);}
        form.removeChild(existinginputs[0]);
        preview.removeChild(existingcanvases[0]);
      } 
    
      for (var i = 0; i < files.length; i++) {
        processfile(files[i]); // process each file at once
      }
      imagesFiles.value = "";

        
        
      
        //remove the original files from fileinput
      // TODO remove the previous hidden inputs if user selects other files
  }

  // this is where it starts. event triggered when user selects files
  
  
    function imagePreviewing(){   
     
      
        if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
          alert('The File APIs are not fully supported in this browser.');
          return false;
          }
      readfiles(imagesFiles.files);
     

  }
  
  // === RESIZE ====

  function resizeMe(img) {    
    
    
    
    var canvas = document.createElement('canvas');

    var width = img.width;
    var height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > max_width) {
        //height *= max_width / width;
        height = Math.round(height *= max_width / width);
        width = max_width;
      }
    } else {
      if (height > max_height) {
        //width *= max_height / height;
        width = Math.round(width *= max_height / height);
        height = max_height;
      }
    }

    
    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    canvas.style.display = "none";
    ctx.drawImage(img, 0, 0, width, height);
    
    preview.appendChild(canvas); // do the actual resized preview
    
    updatedURL = canvas.toDataURL("image/webp",0.7);
    
    var imageURL = new Image();
   //var imageURL =  document.getElementById("image-url");

   imageURL.classList.add("new_image_upload");
   imageURL.src = updatedURL;
   var imageURlOutter = document.createElement("div");
   preview.insertBefore(imageURlOutter, preview.childNodes[0]);
   imageURlOutter.classList.add("image_url_outter");
   imageURlOutter.appendChild(imageURL);
   var imageURlOutterButton = document.createElement("button");
   imageURlOutterButton.classList.add("new_image_remove_button_bg");
   imageURlOutterButton.textContent = "x";
   imageURlOutter.appendChild(imageURlOutterButton);
   
   imagesLength(imageURlOutter);
   var filez= dataURLtoBlob(updatedURL);
    
    
    // Create new form data
    var fd = new FormData();
    fd.append("imageNameHere", filez);
    
   function dataURLtoBlob(dataURLs) {
    // Decode the dataURL    
    var binary = atob(dataURLs.split(',')[1]);
    // Create 8-bit unsigned array
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
     }
    // Return our Blob object
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
     }
    // 
    // var byteString = atob(updatedURL.split(',')[1]);
    // 
    // var arrayBuffer = new ArrayBuffer(100);
    // var uint8Array = new Uint8Array(arrayBuffer);
    // for (var i = 0; i < 100; i++) {
    //   uint8Array[i] = i;
    // }
  
    // var blob1 = new Blob([uint8Array], { type: "image/webp" });
    // var blobVal = URL.createObjectURL(blob1);
    // 
    // var images1 = document.createElement('img');
    // 
    // form.appendChild(images1);
    // images1.src = blobVal;

    //var dec = atob(updatedURL);
    return updatedURL; // get the data from canvas as 70% JPG (can be also PNG, etc.)
  
   
  } 
  function imagesLength(imageCoverPicOutter){
    
    var imageURL1 =  document.getElementsByClassName("new_image_upload");
    if(imageURL1.length === 1){
      var imageCoverPic = document.createElement("span");
      imageCoverPic.classList.add("new_image_cover_pic");
      imageCoverPic.textContent = "cover";
      imageCoverPicOutter.appendChild(imageCoverPic);
    }
    if(imageURL1.length === 4){
      document.getElementById("imagesss").disabled = true;
      imageError.textContent = "max limit exeeded";
      imageError.style.color = "red";
      var addImageDisplayNone = document.getElementById("imagesss").parentNode;
      var addImageDisplayNoneParentOneLevelUp = addImageDisplayNone.parentNode;
      var addImageDisplayNoneParentSecondLevelUp = addImageDisplayNoneParentOneLevelUp.parentNode;
      addImageDisplayNoneParentSecondLevelUp.style.display = "none";
    }
    else{
      document.getElementById("imagesss").disabled = false;
      imageError.textContent = "";
    }
  }
  
  var imageList = document.querySelector("#preview");
  imageList.addEventListener("click", function(imageTarget){
      var imageCoverPicOutter =  document.getElementsByClassName("image_url_outter");
      var imageError = document.getElementById("image_error");      
      var imagedeleting = imageTarget.target;
      var imageWrapper;
      var imageWrapperOutside;
      imageWrapper = imagedeleting.parentNode;
      imageWrapperOutside = imageWrapper.parentNode;
      if(imagedeleting.classList.contains("new_image_remove_button_bg")){              
          document.getElementById("imagesss").disabled = false;
          imageError.textContent = "";
          var addImageDisplayNone = document.getElementById("imagesss").parentNode;
          var addImageDisplayNoneParentOneLevelUp = addImageDisplayNone.parentNode;
          var addImageDisplayNoneParentSecondLevelUp = addImageDisplayNoneParentOneLevelUp.parentNode;
          addImageDisplayNoneParentSecondLevelUp.style.display = "block";
          imageWrapperOutside.removeChild(imageWrapper);
          var imageCoverPic = document.createElement("span");
          imageCoverPic.classList.add("new_image_cover_pic");
          imageCoverPic.textContent = "cover";
          for(var i = 0; i < imageCoverPicOutter.length; i++){                 
            imageCoverPicOutter[imageCoverPicOutter.length - 1].appendChild(imageCoverPic);
          }
        
        
      }
      
  });

// var base_image;
// var basseURL = 'ddrhd';
// base_image = new Image() ;    
// base_image.src = 'data:image/webp;base64,'+ basseURL.substring(basseURL.indexOf('base64') + 7);          

// var canvas = document.getElementById("canvas1");
// var context = canvas.getContext('2d'); //No I18N
// canvas.width = 700;
// canvas.height = 400;
// context.drawImage(base_image, 0, 0, 600, 300);
// var download = document.getElementById("download");
// var image = canvas.toDataURL("image/webp").replace("image/webp","image/octet-stream"); //No I18N
// var imagePath = "../images/" + image;


//  download.setAttribute("href", image);         



/*edit image */
function editImagesLength(){
  var imageCoverPicOutter = document.getElementsByClassName("image_url_outter")  ;
  var imageURL1 =  document.getElementsByClassName("new_image_upload");
  var imageCoverPic = document.createElement("span");
    imageCoverPic.classList.add("new_image_cover_pic");
    imageCoverPic.textContent = "cover";
  
  if(imageURL1.length === 4){
    document.getElementById("imagesss").disabled = true;
    imageError.textContent = "max limit exeeded";
    imageError.style.color = "red";
    var addImageDisplayNone = document.getElementById("imagesss").parentNode;
    var addImageDisplayNoneParentOneLevelUp = addImageDisplayNone.parentNode;
    var addImageDisplayNoneParentSecondLevelUp = addImageDisplayNoneParentOneLevelUp.parentNode;
    addImageDisplayNoneParentSecondLevelUp.style.display = "none";
  }
  else{
    document.getElementById("imagesss").disabled = false;
    imageError.textContent = "";
  }
  for(var i = 0; i <  imageCoverPicOutter.length;i++){
    
    imageCoverPicOutter[imageCoverPicOutter.length-1].appendChild(imageCoverPic);
  }
}
editImagesLength();
/*END edit image */
