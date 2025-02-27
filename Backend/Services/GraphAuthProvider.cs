using Microsoft.Graph;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class TokenProvider
    {
        private readonly IConfidentialClientApplication _clientApplication;
        private readonly string[] _scopes;

        public TokenProvider(IConfidentialClientApplication clientApplication, string[] scopes)
        {
            _clientApplication = clientApplication;
            _scopes = scopes;
        }

        public async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken = default)
        {
            var result = await _clientApplication.AcquireTokenForClient(_scopes).ExecuteAsync(cancellationToken);
            return result.AccessToken;
        }
    }

    public class BaseBearerTokenAuthenticationProvider : IAuthenticationProvider
    {
        private readonly TokenProvider _tokenProvider;

        public BaseBearerTokenAuthenticationProvider(TokenProvider tokenProvider)
        {
            _tokenProvider = tokenProvider;
        }

        public async Task AuthenticateRequestAsync(HttpRequestMessage request)
        {
            var token = await _tokenProvider.GetAccessTokenAsync();
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }
    }
}