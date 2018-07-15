import SparkMD5 from 'spark-md5';

/**
 * 这是一个工具函数，传入一个W3C文件对象，返回该文件的MD5
 * @param file
 * @returns {Promise<any>}
 */
function getMD5(file) {
    return new Promise((resolve, reject) => {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 2097152,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = e => {
            spark.append(e.target.result);
            currentChunk++;

            if(currentChunk < chunks){
                loadNext();
            } else {
                resolve(spark.end());
            }
        };

        fileReader.onerror = () => {
            reject('读取出错');
        };

        function loadNext() {
            let start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }
        loadNext();
    });
}


export {
    getMD5
}