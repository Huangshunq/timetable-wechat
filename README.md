# 课表后台

---

## API 接口

变量名说明：

* code ：微信成功调用 wx.login() 获得的加密字符串
* session_3rd ：自己定义的 3rd\_session （微信登录流程图有说明）
* userInfo ：调用 wx.getUserInfo() 获得的未加密数据
* line ：选择的线路（类型为字符串）
* Session_Val ：登录正方需要的字符串

### GET /wxKey

> 接收：code，userInfo 对象字符串
>
> 返回：session_3rd

---

### GET /wxAdmission

> 接收：session_3rd
>
> 返回：result（验证成功为 true ，失败为 false）

---

### GET /loginData

> 接收：line
>
> 返回：

    {
        "src": checkCodeUri,
        "ASP.NET_SessionId": Session_Val
    }

---

### POST /home

> 接收：ID（学号）、password（密码） 、checkcode（验证码）、Session_Val、session_3rd、line
>
> 返回：

    {
        docData:{
            __VIEWSTATE :   字符串
            xnd         :   返回课程数据的学年
            xqd         :   返回课程数据的学期
            uri         :   链接字符串
        },
        timetableJSON   :   课程表数据
        line
    }

---

### GET /timetable

> 接收：

    {
        Session_Val,
        uri,
        __VIEWSTATE,
        defxnd      :   上一次返回课程数据的学年
        defxqd      :   上一次返回课程数据的学期
        xnd         :   需要查询的学年
        xqd         :   需要查询的学期
        line
    }

> 返回：课程表信息的 json 和 __VIEWSTATE

    {
        main: timetableJSON     课程表数据
        __VIEWSTATE
    }

> 课程表对象内容：

* 课程名 name
* 起始周 startWeek
* 结束周 endWeek
* 星期几 dayOfWeek
* 教师名 teacher
* 教室地点 classroom （可能不存在）
* 开始节时 beginSection
* 节数 sectionNum
* 其它信息 如单双周 weekInfo （可能不存在）

---

## 数据库

### 用户标识信息 UserKey

* （主键 my_session） _id
* openId
* session_key
* unionId （同一用户，对同一个微信开放平台下的不同应用，unionid是相同的）

### 用户微信信息 WeChatInfo = res.userInfo

* （主键 my_session） _id
* 昵称 nickName (= userInfo.nickName)
* 头像 avatarUrl (= userInfo.avatarUrl)
* 性别 gender (= userInfo.gender //性别 0：未知、1：男、2：女)
* 省份 province (= userInfo.province)
* 城市 city (= userInfo.city)
* 国家 country (= userInfo.country)

### 用户在校信息 SchoolInfo

* （主键 my_session） _id
* 学号 ID
* 密码 password
* 姓名 name
* 学院 institute
* 专业 major
* 班级 class

### 用户课表信息 Timetable