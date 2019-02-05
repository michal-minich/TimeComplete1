using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace TimeComplete.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        /*
            
        */
        [HttpPost]
        public ActionResult<LoginApiResult> Login(
            [FromBody] LoginRequestBody loginRequestBody)
        {
            return new LoginApiResult() { DataType = "login" };
        }


        [HttpPost]
        public ActionResult<LoginApiResult> Login2()
        {
            return new LoginApiResult() { DataType = "login2" };
        }


        [HttpPost]
        public ActionResult<PushEventsApiResult> PushEvents(
            [FromBody] IEnumerable<SyncEvent> EventsToPush)
        {
            return new PushEventsApiResult() { DataType = "push" };
        }


        [HttpPost]
        public ActionResult<PullEventsApiResult> PullEvents(
            [FromBody] TokenValue tokenValue)
        {
            return new PullEventsApiResult() { DataType = "pull" };
        }


        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] {"value1", "value2"};
        }


        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }


        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }


        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }


        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }


    public abstract class ApiResult
    {
        public ApiResultStatus Status { get; set; }
        public string DataType { get; set; }
    }


    public sealed class LoginApiResult : ApiResult
    {
        private TokenValue TokeValue { get; set; }
    }


    public sealed class PullEventsApiResult : ApiResult
    {
        private IEnumerable<SyncEvent> EventsToPull { get; set; }
    }


    public sealed class PushEventsApiResult : ApiResult
    {
    }


    public sealed class SyncEvent
    {
    }


    public enum ApiResultStatus
    {
        Ok,
        RequestDataError,
        TemporalStateError,
        InternalServerError
    }


    public sealed class LoginRequestBody
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }


    public sealed class TokenValue
    {
        public string Value { get; set; }
    }
}
