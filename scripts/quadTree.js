var QuadTree = function(numObjects, rootSize){

    var root = null,
        nextId = 0,
        testedSet = [],
        tested = 0,
        that = {
            get root(){return root;},
            get depth() {return findDepth(root);},
            get objectsTested() { return tested; }
        };

    function Node(bounds){
        var children = [],
            members = [],
            boundingCircle = {},
            center = {x:bounds.left + bounds.size/2, y:bounds.top + bounds.size/2};
            node = {
                get size(){return bounds.size;},                                    //getters for specifications of each node
                get isFull(){return members.length >= numObjects;},
                get children() {return children;},
                get hasChildren(){return children.length > 0;},
                get members() {return members;},
                get left() {return bounds.left;},
                get top(){return bounds.top;},
                get center() {return center;},
                
            };

    node.add = function(objectToAdd){                                              //adds node
        var child1 = null,
            child2 = null,
            child3 = null,
            child4 = null,
            member = 0;
            sizeDiv2 = bounds.size/2;

            if(node.isFull){                                                       //if node is full, split node into 4 nodes

                child1 = Node({
                    left:bounds.left,
                    top:bounds.top,
                    size: sizeDiv2
                });

                child2 = Node({
                    left:bounds.left + sizeDiv2,
                    top:bounds.top,
                    size:sizeDiv2
                });

                child3 = Node({
                    left:bounds.left,
                    top:bounds.top + sizeDiv2,
                    size:sizeDiv2
                });

                child4 = Node({
                    left:bounds.left + sizeDiv2,
                    top:bounds.top + sizeDiv2,
                    size:sizeDiv2
                });
                children = [child1, child2, child3, child4];                                //if node was split, add new nodes to list of children

                for(member = 0; member< node.members.length; member++){                     //insert objects that already existed into the new node
                    insert(node, members[member]);
                } 
                insert(node,objectToAdd);                                                   //insert the new object to add into the new node.
            }
            else{
                members.push(objectToAdd);
            }
    };

    return node;
}

function insert(node, objectToAdd){
    var child = 0;
    if(that.objectInSquare(objectToAdd, node)){
        if(node.hasChildren){
            for(child = 0; child < node.children.length; child++){
                insert(node.children[child], objectToAdd);
            }
        }
        else{
            node.add(objectToAdd);
            }
        }
    }

    that.insert = function(objectToAdd){
        objectToAdd.id = nextId;
        nextId += 1;
        insert(root, objectToAdd);
    }

    function intersects(node, objectToAdd){
       var child = 0,
        member = 0;
        hit = null;

        if(that.objectInSquare(objectToAdd, node)){
            if(node.hasChildren){
                for (child = 0; child < node.children.length; child++ ){
                    hit = intersects(node.children[child], objectToAdd);
                    if(hit){
                        return hit;
                    }
                }
            }
            else{
                for (member = 0; member < node.members.length; member++){
                    if(objectToAdd !== node.members[member]){
                        if(node.members[member].intersects(objectToAdd)){
                            return node.members[member];
                        }
                    }
                }
            }
         }
        return null;
    }

    that.intersects = function(objectToAdd){
        var other = null;
        other = intersects(root, objectToAdd);
        return other;
    }

//helper function to visibleObjects. Checks to see if objects are visible (within or touching the camera)

    function findVisible(node, camera, viewArea, visible){
        var child = 0;
            member = 0,
            objectToAdd = null;

        if(that.objectInSquare(camera.boundingCircle, node))
           if(node.hasChildren){
                for(child = 0; child < node.children.length; child++){
                    findVisible(node.children[child], camera, viewArea, visible);
                }
           } else{
               for (member = 0; member < node.members.length; member++){
                   objectToAdd = node.members[member];

                   if(testedSet[objectToAdd.id] === undefined){
                       testedSet[objectToAdd.id] = true;
                       tested += 1;
                       if(objectToAdd.intersects(camera.boundingCircle)){
                           if(that.objectInSquare(objectToAdd, viewArea)){
                               visible.push(objectToAdd);
                       }

                   }
               }
           }
        }
           
    }

//Checks to see if object is within the camera view.
    that.visibleObjects = function(camera){
        var visible = [],
            viewArea = {
                    pt1: camera.pt1, 
                    pt2: camera.pt2,
                    pt3: camera.pt3,
                    pt4: camera.pt4,
                    center:{x:(camera.pt1.x + camera.pt3.x)/2 , y:(camera.pt1.y + camera.pt2.y)/2}
            };

        tested = 0;
        testedSet.length = 0;
        testedSet.length = nextId;
        findVisible(root, camera, viewArea, visible);

        return visible;
    };
    
    function depthSearch(node){
        var depth0 = 0,
            depth1 = 0,
            depth2 = 0,
            depth3 = 0;

        if(node.hasChildren){
            depth0 = depthSearch(node.children[0]);
            depth1 = depthSearch(node.children[1]);
            depth2 = depthSearch(node.children[2]);
            depth3 = depthSearch(node.depthSearch[3]);

            return 1 + Math.max(Math.max(depth0, depth1), Math.max(depth2, depth3));
        }

        return 1;
    }

//checks to see if an object is within a given square. Returns true if any part of the object is in the square.

    that.objectInSquare = function(objectToAdd, square){
        var squareDiv2 = square.size/2,
            objectDistanceX,
            objectDistanceY,
            distanceX,
            distanceY,
            cornerDistanceSq;

        objectDistanceX = Math.abs(objectToAdd.center.x - square.center.x);
        if(objectDistanceX > (squareDiv2 + objectToAdd.radius)) {return false;}
        objectDistanceY = Math.abs(objectToAdd.center.y - square.center.y);
        if(objectDistanceY > (squareDiv2 + objectToAdd.radius)) {return false};

        if(objectDistanceX <= squareDiv2) { return true;}
        if(objectDistanceY <= squareDiv2) { return true;}

        distanceX = (objectDistanceX - squareDiv2);
        distanceY = (objectDistanceY - squareDiv2);
        distanceX *= distanceX;
        distanceY *= distanceY;

        cornerDistanceSq = distanceX + distanceY;
        return ( cornerDistanceSq <= objectToAdd.radiusSq);
    }

//Creates a circle around a given square
    that.circleFromSquare = function(pointA, pointB, pointC){
        var circleSpec = {
            center: {},
            radius: 0
        },

        midPointAB = {
            x: (pointA.x + pointB.x)/2,
            y: (pointA.y + pointB.y)/2
        },

        midPointAC = {
            x:(pointA.x + pointC.x)/2,
            y:(pointA.y + pointC.y)/2
        },
            slopeAB = (pointB.y - pointA.y)/(pointB.x - pointA.x),
            slopeAC = (pointC.y - pointA.y)/(pointC.x - pointA.x);
        slopeAB = -(1/slopeAB);
        slopeAC = -(1/slopeAC);

        circleSpec.center.x = midPointAC.x;
        circleSpec.center.y = midPointAB.y;
        circleSpec.radius = Math.sqrt(Math.pow(circleSpec.center.x - pointA.x, 2) + Math.pow(circleSpec.center.y - pointA.y, 2));

        return math.Circle(circleSpec);
    }

//defines the root node
    root = Node({
        left: 0,
        top: 0,
        size: rootSize
    });
    return that;
}


//objects to test in quad tree must contain these attributes:
//       radiusSq - the radius of the object's area squared
//       radius - the radius around an enemy or object
//       center - the center of the enemy or object (this should be done already)

//viewArea must contain:
//       center
//       size

//'camera' as seen above must contain:
//       BoundingCircle (circle around visible space to test intersection with)
  