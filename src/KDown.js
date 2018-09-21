
/**
 * @class kDown
 * @author kfdykme
 */
export default class KDown{


    constructor(text){
        this.content = text
        this.style = ""
    }


    setStyle(data){

        this.style = "<style>"+data+"</style>"
    }

    /**
     * @method build
     * @return html
     */
    build(){
        this.buildH125()
        .buildBNI()
        .buildMap()
        .buildLi()
        .buildA()

        // const style = "<link rel=\"stylesheet\" media=\"all\" href=\"./kdown.css\">"
        return "<html><head>"+this.style+"<meta charset='UTF-8'></head><body>"+this.content+"</body>"

    }



    /**
     * @method buildA
     * @desc 超链接
     */
    buildA(){

        //NOTE : a
        // const aRexType2 = /\[.*?\]\[.*?\]/g
        const aRex = /\[.*?\]\(.*?\)/g
        var ar = this.content.match(aRex)
        // console.info(res.ar)aaa
        for(var x in  ar){
            var arr =  ar[x].split("](")
            var content = arr[0].substring(1)
            var url = arr[1]
            url = url.substring(0,url.length-1)
            var result = "<a href=\""+url+"\" target=\"_blank\">"+content+"</a>"
            this.content = this.content.replace( ar[x],result)
        }


        return this
    }


    /**
     * @method buildMap
     * @desc 构造map
     */
    buildMap(){


            //NOTE: map
            const mapRex = /``` map\r\n(.*\r\n)*?```/g
            var mapr = this.content.match(mapRex)
            var nodes = []
            for(var x in  mapr){
                var context =  mapr[x]
                const record = context
                context = context.substring(9,context.length-3)
                // console.info(context)

                // 清除注释
                const commentRex = /\/\/.*\r\n/g
                var commentResult = context.match(commentRex)
                for(var y in commentResult){
                    context = context.replace(commentResult[y],"\r\n")
                }

                //
                //
                const nodeRex = /--\r\n(.*\r\n)*?--/g
                var nodeResult = context.match(nodeRex)
                for(var z in nodeResult){
                    var node = nodeResult[z]
                    node = node.substring(4,node.length -2)
                    // console.info(node)
                    const arrowRex = /->.*\r\n/g
                    var arrowResult = node.match(arrowRex)

                    var n = {
                        content : "",
                        to:[],
                        weight:0,
                        left :"0",
                        top:"0",
                        loc:false
                    }

                    for(var a in arrowResult){
                        var arrow = arrowResult[a]
                        node = node.replace(arrow,"")
                        arrow = arrow.substring(2,arrow.length-2)
                        this.push(n.to,arrow)
                    }

                    var contentResult = node.match(/.*\r\n/g)
                    for(var c in contentResult){
                        var content = contentResult[c]
                        n.content = content.substring(0,content.length-2)

                    }
                    this.push(nodes,n)
                }



                //makeupMap
                var maps = ""
                maps += "<div class=\"map\">"
                maps += this.convertMapNodes(nodes)
                maps +="</div>"

                this.content = this.content.replace(record,maps)

            }

            return this
    }


    /**
     * @method buildBNI
     * @desc 处理粗体和斜体
     */
    buildBNI(){


        //NOTE: b & i
        const blodRex = /(\*\*).*(\*\*)/g

        const iRex = /(\*).*(\*)/g
        var blodr = this.content.match(blodRex)
        for(var x in blodr){
            this.content = this.replace(blodr[x],2,2,"b",this.content)
        }

        var ir = this.content.match(iRex)
        for(var x in  ir){
            this.content = this.replace( ir[x],1,1,"i",this.content)
        }

        return this
    }



    /**
     * @method buildH125
     * @param {string} content
     * @return {string} 处理过标题的string
     * @desc 处理标题
     */
    buildH125(){

            // NOTE : H1~5
            const h1Rex = /#\s.*\r/g
            const h2Rex = /##\s.*\r/g
            const h3Rex = /###\s.*\r/g
            const h4Rex = /####\s.*\r/g
            const h5Rex = /#####\s.*\r/g
            var h1r = this.content.match(h1Rex)
            var h2r = this.content.match(h2Rex)
            var h3r = this.content.match(h3Rex)
            var h4r = this.content.match(h4Rex)
            var h5r = this.content.match(h5Rex)

            for(var x in h5r){

                this.content = this.replace(h5r[x], 6,1, "h5", this.content)

            }

            for(var x in h4r){

                this.content = this.replace(h4r[x], 5, 1,"h4", this.content)
            }

            for(var x in h3r){
                this.content = this.replace(h3r[x], 4, 1,"h3", this.content)
            }

            for(var x in h2r){
                this.content = this.replace(h2r[x], 3,1, "h2", this.content)
            }

            for(var x in h1r){
                this.content = this.replace(h1r[x], 2,1, "h1", this.content)
            }

            return this

    }


    /**
     * @method buildLi
     * @desc 构造列表
     */
    buildLi(){

        //NOTE : LI
        const liRex = /\n-.*\r\n( *-.*\r\n)*/g
        var lir = this.content.match(liRex)
        for(var x in   lir){
            var liresult = this.dealwithLi(  lir[x])

            this.content = this.content.replace(  lir[x],liresult)
        }

        return this
    }




    /**
     * @method convertMapNodes
     * @param {array} nodes
     * @return {array}
     */
    convertMapNodes(nodes){
        for(var x in nodes ){

            nodes[x].weight = nodes[x].to.length
        }

        nodes =  sort(nodes)

        var first = nodes[0]
        first.left = 50
        first.top = 50

        startNode(first,0,360,nodes)

        // console.info(nodes)
        // console.info(first)
        return toString(nodes)

        function startNode(first,startD,endD,arr){

            startD = startD % 360
            endD = endD % 360

            var allDegree = endD - startD
            allDegree = allDegree == 0 ? 360 : allDegree


            var num = first.to.length

            const perDegree = allDegree / (num+1)



            var x  =first.left
            var y = first.top
            var r = 20


            for(var n in first.to){
                var to = getNode(arr,first.to[n])

                var pos = n/1 +1


                var degree = pos*perDegree + startD
                degree = degree /180 * Math.PI
                if(!to.loc){
                    to.loc = true
                    to.left = Math.cos(degree) * r + x
                    to.top = Math.sin(degree) * r + y
                }
                startNode(to,startD,endD,arr)
            }


        }

        /**
         * @method toString
         * @param {array} nodes
         * @return {string}
         */
        function toString(nodes){
            var s = ""
            var style = "<style>"
            style += ".node { margin:10px; position:absolute;background-color:#eee;;border-radius: 4%;text-align: center;padding: 1%;border-width: 0;}"
            for(var x in nodes){
                var n = nodes[x]

                s += "<div class=\"node "+n.content+"\" style>"
                s += n.content
                style += "  ."+n.content+" { left:"+n.left+"%; top:"+n.top+"%;widht:"+n.content.length+"% }  "
                s += "</div>"

            }

            style += "</style>"

            s+=style
            return s
        }

        /**
         * @method sort
         * @param {array} nodes
         * @return {array}
         */
        function sort(nodes){
            var again = true
            while(again){
                again = false
                for(var x in nodes){
                    if(x/1 == nodes.length -1)
                        break;

                    var n = nodes[x]
                    var nex = nodes[x/1+1]
                    if(n.weight < nex.weight)
                    {

                        nodes[x] = nex
                        nodes[x/1+1] = n
                        again = true
                    }
                }
            }

            return nodes
        }

        /**
         * @method getNode
         * @param {array} arr
         * @param {string} name
         */
        function getNode(arr,name){
            var a = null
            for(var x in arr){
                if(name == arr[x].content)
                    a = arr[x]
            }
            return a
        }
    }



    /**
     * @method dealwithLi
     * @param {string} litext
     * @return {string}
     * @desc 处理列表
     */
     dealwithLi(litext){


        const singleLiRex = / *- .*\r\n/g
        var result = litext.match(singleLiRex)
        var liItemList = []

        // 一个数组,用于保存层级信息
        var deeps = []
        for(var x in result){
            var rx = result[x].match(/\S/)
            var liItem = {
                pos : x,
                textDeepth : rx.index,
                content: rx.input.substring(rx.index+2,rx.input.length-2),
                child:[]
            }

            liItemList.push(liItem)

            //尝试把deep添加进deep这个数组中
            this.push(deeps,rx.index)
        }

        for(var x in liItemList){
            var i = liItemList[x]
            i.deepth = this.pos(deeps,i.textDeepth)
        }

        liItemList = this.convertList(liItemList)


        return toString(liItemList)

        function toString(list){
            if(list.length == 0) return ""

            var s ="<ul>"
            for(var x in list){

                s += "<li>"
                s += list[x].content
                s += "</li>"
                // console.info(s)
                s += toString(list[x].child)

            }
            s+="</ul>"

            return s
        }


    }


    /**
     * @method convertList
     * @param {array} list
     * @for dealwithLi
     * @desc 哈哈哈
     */
     convertList(list){

        //遍历li item
        for(var x in list){
            var newList = []

            // 如果已经是最后一个
            if((x/1) == (list.length-1)) break;
            // 取一个item
            var i = list[x]


            // 从取到的开始,到下一个deep与该item相同的为止
            for(var y in list){
                if(y/1 <= x/1) continue

                if(list[y].deepth == (i.deepth/1+1)){
                    this.push(i.child,list[y])
                }
                if(list[y].deepth > i.deepth)
                    newList.push(list[y])

                if(list[y].deepth == i.deepth)
                    break;
            }



            this.convertList(newList)

        }

        var newList = []
        for(var x in list){
            if(list[x].deepth == 0)
                newList.push(list[x])
        }
        list = newList
        return list
    }


    /**
     * @method pos
     * @param {array} arr
     * @param {number} e
     * @return {number} e 在arr中的位置
     * @for dealwithLi
     */
     pos(arr,e){
        for(var x in arr){
            if(arr[x] == e) return x
        }
    }

    /**
    * @method push
    * @param {array} arr
    * @param {number} e
    * @for dealwithLi
    * @desc 如果e不在arr中,则添加e进arr
    */
    push(arr,e){
        for(var x in arr)
        if(arr[x] == e)
            return
        arr.push(e)
    }



    /**
     * @method replace
     * @param {string} value
     * @param {number} startIndex
     8 @param {number}
     * @param {string} tag
     * @param {string} target
     * @return {string}
     * @desc
     */
     replace(value,startIndex,endIndex,tag,target){
        let v = value.substring(startIndex,value.length-endIndex)

        let replacement = "<"+tag+">"+v+"</"+tag+">"

        return target.replace(value,replacement)
    }

}
