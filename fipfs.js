
App2 ={
    init: async function(){
        const node = await Ipfs.create({ repo: String(Math.random() + Date.now()) })

        console.log('IPFS node is ready');
        window.node = node;

    },
    submit: async function(){
        var tex = document.getElementById("ip");
        console.log(tex.value);
        
        for await (const file of node.add(tex.value)){
            if (file && file.cid) {
                console.log('successfully stored', file.cid)
        
                await App2.display(file.cid)
            }
        
        }

    },
    display: async function(cid) {
        for await (const data of node.cat(cid)) {
          document.getElementById('cid').innerText = cid
          document.getElementById('content').innerText = data
          document.getElementById('output').setAttribute('style', 'display: block')
        }
    }

}

window.onload = function () {
    App2.init();
};
