
App2 ={
    init: async function(){
        const node = await Ipfs.create({ repo: String(Math.random() + Date.now()) })

        console.log('IPFS node is ready');
        window.node = node;

    },
    submit: async function(){
        var tex = document.getElementById("ip");
        var times = tex.files.length;
        var i = 0;
        while(i < times)
        for await (const file of node.add(tex.files[i])){
            if (file && file.cid) {
                console.log('successfully stored', file.cid)
        
                await App.display(file.cid,i)
                i++;
            }
        }
    },
    display: async function(cid,times) {
        for await (const data of node.cat(cid)) {
          document.getElementById('cid').innerText = document.getElementById('cid').innerText + cid + "\n";
          document.getElementById('content').insertAdjacentHTML("afterend", "<img src = https://ipfs.io/ipfs/"+cid+">");
          
        }
    },
    check: async function(){
        var tex = document.getElementById("ip");
        console.log(tex.files.length);
    }

}

window.onload = function () {
    App2.init();
};
