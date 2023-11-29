## ArcRotateCamera 参数设置

const camera = new BABYLON.ArcRotateCamera(
'camera',
-Math.PI / 2,
Math.PI / 2,
10,
new BABYLON.Vector3(0, 0, 0),
scene
)

name (字符串): 相机的名称，用于在场景中标识相机。

alpha (弧度值): alpha 表示相机绕 Y 轴的旋转角度。
当 alpha 为 0 时，相机的朝向是正 X 轴的方向。这意味着相机最初指向场景中的正 X 轴。
随着 alpha 的增加，相机逆时针旋转，改变其朝向。

beta (弧度值): beta 表示相机绕 X 轴的旋转角度。
当 beta 为 Math.PI / 2 时，相机水平居中。这意味着相机的视线水平朝向场景。
随着 beta 的增加，相机绕 X 轴旋转，向上或向下倾斜，改变其仰角。

radius (数值): 相机到目标点的距离。这个值决定了相机的缩放。

target (Vector3): 相机所看向的目标点的位置。

scene (Scene): 相机所属的场景。
